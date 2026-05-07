package models;

/**
 * Component 06: Polymorphism - Public review (any customer can submit)
 */
public class PublicReview extends Review {

    public PublicReview(int reviewId, int customerId, int roomNumber, int rating,
                        String title, String comment, String date, boolean approved) {
        super(reviewId, customerId, roomNumber, rating, title, comment, date, approved);
    }

    @Override
    public String displayForCustomer() {
        return String.format("[%s] %s\n%s\n— Customer #%d, %s",
                stars(), getTitle(), getComment(), getCustomerId(), getDate());
    }

    @Override
    public String displayForAdmin() {
        return String.format("[PUBLIC] Review #%d [%s] %s | Cust:%d | Room:%d | %s | Approved: %s\n  %s",
                getReviewId(), stars(), getTitle(), getCustomerId(), getRoomNumber(),
                getDate(), isApproved(), getComment());
    }

    @Override
    public String getType() {
        return "PUBLIC";
    }
}
