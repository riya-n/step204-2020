package com.google.job.data;

/** Class that represents the location of a job or an applicant. */
public final class Location {
    // TODO(issue/23): add "postalCode" and deal with optional address
    private final String address;
    private final double latitude;
    private final double longitude;

    private int hashCode;

    // For serialization
    public Location() {
        this.address = "";
        this.latitude = 0;
        this.longitude = 0;
    }

    public Location(String address, double latitude, double longitude) {
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    /**
     * Gets address description of a place.
     *
     * @return Address description.
     */
    public String getAddress() {
        return address;
    }

    /**
     * Gets the latitude of the place.
     *
     * @return Latitude of the place.
     */
    public double getLatitude() {
        return latitude;
    }

    /**
     * Gets the longitude of the place.
     *
     * @return Longitude of the place.
     */
    public double getLongitude() {
        return longitude;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Location that = (Location) o;
        return Double.compare(that.latitude, latitude) == 0 &&
                Double.compare(that.longitude, longitude) == 0 &&
                address.equals(that.address);
    }

    @Override
    public int hashCode() {
        if (this.hashCode != 0) {
            return this.hashCode;
        }

        int c = ((Double) latitude).hashCode();
        hashCode = 31 * hashCode + c;

        c = ((Double) longitude).hashCode();
        hashCode = 31 * hashCode + c;

        c = address.hashCode();
        hashCode = 31 * hashCode + c;

        return hashCode;
    }

    @Override
    public String toString() {
        return String.format("JobLocation{address=%s, latitude=%f, longitude=%f}",
                address, latitude, longitude);
    }
}
