package com.google.job.data;

import com.google.api.core.ApiFunction;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.*;
import com.google.cloud.firestore.Query.Direction;
import com.google.common.collect.ImmutableList; 
import com.google.common.util.concurrent.MoreExecutors;
import com.google.utils.FireStoreUtils;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;
import org.apache.commons.lang3.Range;
import java.lang.UnsupportedOperationException;

import java.io.IOException;
import java.util.Optional;
import java.util.concurrent.Future;
import java.util.List;
import java.io.IOException;

/** Helps persist and retrieve job posts. */
public final class JobsDatabase {
    private static final String JOB_COLLECTION = "Jobs";
    private static final String SALARY_FIELD = "jobPay.annualMax";
    private static final String REGION_FIELD = "jobLocation.region";
    private static final String JOB_STATUS_FIELD = "jobStatus";
    private static final long TIMEOUT = 5;

    /**
     * Adds a newly created job post.
     *
     * @param newJob Newly created job post. Assumes that it is non-nullable.
     * @return A future of the detailed information of the writing.
     */
    public Future<WriteResult> addJob(Job newJob) throws IOException {
        // Add document data after generating an id
        DocumentReference addedDocRef = FireStoreUtils.getFireStore()
                .collection(JOB_COLLECTION).document();

        String jobId = addedDocRef.getId();

        // Updates the Job with cloud firestore id
        // Status is already set when parsing the job post
        Job job = newJob.toBuilder()
                .setJobId(jobId)
                .build();

        return addedDocRef.set(job);
    }

    /**
     * Edits the job post.
     *
     * @param jobId Id for the target job post in the database.
     * @param updatedJob Updated job post.
     * @return A future of document reference for the updated job post.
     * @throws IllegalArgumentException If the job id is invalid.
     */
    public Future<DocumentReference> setJob(String jobId, Job updatedJob) throws IllegalArgumentException, IOException {
        if (jobId.isEmpty()) {
            throw new IllegalArgumentException("Job Id should be an non-empty string");
        }
        
        // Sets the Job with cloud firestore id and ACTIVE status
        Job job = updatedJob.toBuilder()
                .setJobId(jobId)
                .build();

        // Runs an asynchronous transaction
        ApiFuture<DocumentReference> futureTransaction = FireStoreUtils.getFireStore().runTransaction(transaction -> {
            final DocumentReference documentReference = FireStoreUtils.getFireStore()
                    .collection(JOB_COLLECTION).document(jobId);

            // Verifies if the current user can update the job post with this job id
            // TODO(issue/25): incorporate the account stuff into job post.
            DocumentSnapshot documentSnapshot = transaction.get(documentReference).get();

            // Job does not exist
            if (!documentSnapshot.exists()) {
                throw new IllegalArgumentException("Invalid jobId");
            }

            // Overwrites the whole job post
            transaction.set(documentReference, job);

            return documentReference;
        });
        
        return futureTransaction;
    }

    /**
     * Marks a job post as DELETED.
     *
     * @param jobId Cloud Firestore Id of the job post.
     * @return A future of document reference for the updated job post.
     */
    public Future<DocumentReference> markJobPostAsDeleted(String jobId) throws IOException {
        if (jobId.isEmpty()) {
            throw new IllegalArgumentException("Job Id should be an non-empty string");
        }
        
        // Runs an asynchronous transaction
        ApiFuture<DocumentReference> futureTransaction = FireStoreUtils.getFireStore().runTransaction(transaction -> {
            final DocumentReference documentReference = FireStoreUtils.getFireStore()
                    .collection(JOB_COLLECTION).document(jobId);

            // Verifies if the current user can update the job post with this job id
            // TODO(issue/25): incorporate the account stuff into job post.
            DocumentSnapshot documentSnapshot = transaction.get(documentReference).get();

            // Job does not exist
            if (!documentSnapshot.exists()) {
                throw new IllegalArgumentException("Invalid jobId");
            }

            // Updates the jobStatus field to DELETED
            transaction.update(documentReference, JOB_STATUS_FIELD, JobStatus.DELETED);

            return documentReference;
        });

        return futureTransaction;
    }

    /**
     * Fetches the snapshot future of a specific job post.
     *
     * @param jobId Id for the job post in the database.
     * @return Future of the target job post.
     * @throws IllegalArgumentException If the job id is invalid.
     */
    public Future<Optional<Job>> fetchJob(String jobId) throws IllegalArgumentException, IOException {
        DocumentReference docRef = FireStoreUtils.getFireStore()
                .collection(JOB_COLLECTION).document(jobId);

        // Asynchronously retrieves the document
        ApiFuture<DocumentSnapshot> snapshotFuture = docRef.get();

        ApiFunction<DocumentSnapshot, Optional<Job>> jobFunction = new ApiFunction<DocumentSnapshot, Optional<Job>>() {
            @NullableDecl
            public Optional<Job> apply(@NullableDecl DocumentSnapshot documentSnapshot) {
                return FireStoreUtils.convertDocumentSnapshotToPOJO(documentSnapshot, Job.class);
            }
        };

        return ApiFutures.transform(snapshotFuture, jobFunction, MoreExecutors.directExecutor());
    }

    /**
     * Gets all the jobs given the params from the database.
     * Currently, they can only be sorted/filtered by salary.
     *
     * @param jobQuery The job query object with all the filtering/sorting params.
     * @return Future of the JobPage object.
     */
    public static Future<JobPage> fetchJobPage(JobQuery jobQuery) throws IOException {
        CollectionReference jobsCollection = FireStoreUtils.getFireStore().collection(JOB_COLLECTION);

        // TODO(issue/62): support other filters
        if (!jobQuery.getSortBy().equals(Filter.SALARY)) {
            throw new UnsupportedOperationException("currently this app only supports sorting/filtering by salary");
        }

        Query query = jobsCollection.whereGreaterThanOrEqualTo(SALARY_FIELD, jobQuery.getMinLimit())
            .whereLessThanOrEqualTo(SALARY_FIELD, jobQuery.getMaxLimit())
            .orderBy(SALARY_FIELD, Order.getQueryDirection(jobQuery.getOrder()));

        SingaporeRegion region = jobQuery.getRegion();
        if (!region.equals(SingaporeRegion.ENTIRE)) {
            query = query.whereEqualTo(REGION_FIELD, region.name());
        }

        // TODO(issue/34): add to the query to include pagination (using pageSize and pageIndex)

        return ApiFutures.transform(
            query.get(),
            new ApiFunction<QuerySnapshot, JobPage>() {
                @NullableDecl
                public JobPage apply(@NullableDecl QuerySnapshot querySnapshot) {
                    List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();
                    ImmutableList.Builder<Job> jobList = ImmutableList.builder();

                    for (QueryDocumentSnapshot document : documents) {
                        Job job = document.toObject(Job.class);
                        jobList.add(job);
                    }
            
                    // TODO(issue/34): adjust range/total count based on pagination
                    long totalCount = documents.size();
                    Range<Integer> range = Range.between(1, documents.size());

                    return new JobPage(jobList.build(), totalCount, range);
                }   
            },
            MoreExecutors.directExecutor()
        );
    }
}
