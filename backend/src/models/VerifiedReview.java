package models;

/**
 * Component 06: Polymorphism - Verified review (only from customers who actually stayed)
 */
public class VerifiedReview extends Review {
    private int reservationId; // Proof of stay

    public VerifiedReview(int reviewId, int customerId, int roomNumber, int rating,
                          String title, String comment, String date, boolean approved, int reservationId) {
        super(reviewId, customerId, roomNumber, rating, title, comment, date, approved);
        this.reservationId = reservationId;
    }

    public int getReservationId() { return reservationId; }
    public void setReservationId(int reservationId) { this.reservationId = reservationId; }

    @Override
    public String displayForCustomer() {
        return String.format("[%s] ✓ VERIFIED GUEST — %s\n%s\n— Customer #%d, %s",
                stars(), getTitle(), getComment(), getCustomerId(), getDate());
    }

    @Override
    public String displayForAdmin() {
        return String.format("[VERIFIED] Review #%d [%s] %s | Cust:%d | Room:%d | Res:%d | %s | Approved: %s\n  %s",
                getReviewId(), stars(), getTitle(), getCustomerId(), getRoomNumber(),
                reservationId, getDate(), isApproved(), getComment());
    }

    @Override
    public String getType() {
        return "VERIFIED";
    }

    @Override
    public String toFileString() {
        // Append reservationId at the end for verified reviews
        return super.toFileString() + "|" + reservationId;
    }
}
