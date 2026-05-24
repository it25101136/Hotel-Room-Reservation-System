package models;

/**
 * PublicReview represents a review submitted by a customer.
 *
 * This type of review is visible to the public but requires admin approval
 * before being marked as approved/visible in the system.
 *
 * Demonstrates OOP concepts:
 * - Inheritance (extends Review)
 * - Polymorphism (method overriding)
 */
public class PublicReview extends Review {

    /**
     * Constructor for PublicReview.
     * Initializes all review details by calling the parent Review class.
     */
    public PublicReview(int reviewId, int customerId, int roomNumber, int rating,
                        String title, String comment, String date, boolean approved) {
        super(reviewId, customerId, roomNumber, rating, title, comment, date, approved);
    }

    /**
     * Displays review in a customer-friendly format.
     * Used when showing reviews on customer-facing pages.
     */
    @Override
    public String displayForCustomer() {
        return String.format("[%s] %s\n%s\n— Customer #%d, %s",
                stars(), getTitle(), getComment(), getCustomerId(), getDate());
    }

    /**
     * Displays review in an admin-friendly format.
     * Includes additional details like review ID, room number, and approval status.
     */
    @Override
    public String displayForAdmin() {
        return String.format(
                "[PUBLIC] Review #%d [%s] %s | Cust:%d | Room:%d | %s | Approved: %s\n  %s",
                getReviewId(), stars(), getTitle(), getCustomerId(), getRoomNumber(),
                getDate(), isApproved(), getComment());
    }

    /**
     * Returns the type of review.
     * Used to distinguish between PUBLIC and VERIFIED reviews.
     */
    @Override
    public String getType() {
        return "PUBLIC";
    }
}