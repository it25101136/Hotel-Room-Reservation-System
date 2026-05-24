package models;

/**
 * VerifiedReview represents a review that is linked to a real reservation.
 *
 * This type of review is automatically considered more trustworthy because
 * it comes from an actual customer who has completed a booking.
 *
 * Demonstrates OOP concepts:
 * - Inheritance (extends Review)
 * - Polymorphism (method overriding)
 * - Encapsulation (private reservationId field)
 */
public class VerifiedReview extends Review {

    // Reservation ID linked to this verified review
    private int reservationId;

    /**
     * Constructor for VerifiedReview.
     * Includes reservationId to link review with a real booking.
     */
    public VerifiedReview(int reviewId, int customerId, int roomNumber, int rating,
                          String title, String comment, String date, boolean approved,
                          int reservationId) {

        super(reviewId, customerId, roomNumber, rating, title, comment, date, approved);
        this.reservationId = reservationId;
    }

    // Getter for reservationId
    public int getReservationId() { return reservationId; }

    // Setter for reservationId
    public void setReservationId(int reservationId) { this.reservationId = reservationId; }

    /**
     * Displays review in a customer-friendly format.
     * Shows VERIFIED badge to indicate authenticity.
     */
    @Override
    public String displayForCustomer() {
        return String.format("[%s] ✓ VERIFIED GUEST — %s\n%s\n— Customer #%d, %s",
                stars(), getTitle(), getComment(), getCustomerId(), getDate());
    }

    /**
     * Displays review in admin format.
     * Includes reservation ID for verification purposes.
     */
    @Override
    public String displayForAdmin() {
        return String.format(
                "[VERIFIED] Review #%d [%s] %s | Cust:%d | Room:%d | Res:%d | %s | Approved: %s\n  %s",
                getReviewId(), stars(), getTitle(), getCustomerId(), getRoomNumber(),
                reservationId, getDate(), isApproved(), getComment());
    }

    /**
     * Returns type of review.
     * Used to distinguish VERIFIED reviews from PUBLIC reviews.
     */
    @Override
    public String getType() {
        return "VERIFIED";
    }

    /**
     * Converts object to file storage format.
     * Adds reservationId on top of parent class data.
     */
    @Override
    public String toFileString() {
        return super.toFileString() + "|" + reservationId;
    }
}