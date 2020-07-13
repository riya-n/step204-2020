package com.google.job.data;

import com.google.api.core.ApiFunction;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.*;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.utils.FireStoreUtils;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;

import java.util.Optional;
import java.util.concurrent.Future;

/** Helps persist and retrieve job posts. */
public final class JobsDatabase {
    private static final String JOB_COLLECTION = "Jobs";
    private static final String JOB_ID_FIELD = "jobId";

    /**
     * Adds a newly created job post.
     *
     * @param newJob Newly created job post. Assumes that it is non-nullable.
     * @return Auto-generated cloud firestore id and a future of the detailed information of the update.
     */
    public AddJobResult addJob(Job newJob) {
        // Add document data after generating an id.
        DocumentReference addedDocRef = FireStoreUtils.getFireStore()
                .collection(JOB_COLLECTION).document();

        String jobId = addedDocRef.getId();

        addedDocRef.set(newJob);

        // (async) Update jobId field with the auto generated id
        Future<WriteResult> future = addedDocRef.update(JOB_ID_FIELD, jobId);

        return new AddJobResult(jobId, future);
    }

    /**
     * Edits the job post.
     *
     * @param jobId Id for the target job post in the database.
     * @param job Updated job post.
     * @return A future of the detailed information of the update.
     * @throws IllegalArgumentException If the job id is invalid.
     */
    public Future<WriteResult> setJob(String jobId, Job job) throws IllegalArgumentException {
        // Overwrites the whole job post
        return FireStoreUtils.getFireStore()
                .collection(JOB_COLLECTION).document(jobId)
                .set(job);
    }

//    /**
//     * Updates the auto-generated cloud firestore id into the jobId field of the specific job post.
//     *
//     * @param jobId Cloud Firestore Id of the job post.
//     * @return A future of the detailed information of the update.
//     */
//    public Future<WriteResult> updateJobId(String jobId) {
//        DocumentReference documentReference = FireStoreUtils.getFireStore().collection(JOB_COLLECTION).document(jobId);
//        // (async) Update one field
//        return documentReference.update(JOB_ID_FIELD, jobId);
//    }

    /**
     * Fetches the snapshot future of a specific job post.
     *
     * @param jobId Id for the job post in the database.
     * @return Future of the target job post.
     * @throws IllegalArgumentException If the job id is invalid.
     */
    public Future<Optional<Job>> fetchJob(String jobId) throws IllegalArgumentException {
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
}
