package models;

/**
 * Component 06 — Review Management
 * Abstract Review class — Encapsulation + Inheritance.
 * Author: Member 5
 */
public abstract class Review {
    private int reviewId;
    private int customerId;
    private int roomNumber;
    private int rating;       // 1-5
    private String title;
    private String comment;
    private String date;      // YYYY-MM-DD
    private boolean approved;

    public Review(int reviewId, int customerId, int roomNumber, int rating,
                  String title, String comment, String date, boolean approved) {
        this.reviewId = reviewId;
        this.customerId = customerId;
        this.roomNumber = roomNumber;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.date = date;
        this.approved = approved;
    }

    public int getReviewId() { return reviewId; }
    public void setReviewId(int reviewId) { this.reviewId = reviewId; }
    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }
    public int getRoomNumber() { return roomNumber; }
    public void setRoomNumber(int roomNumber) { this.roomNumber = roomNumber; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    /** Polymorphism — different display for admin vs customer */
    public abstract String displayForCustomer();
    public abstract String displayForAdmin();
    public abstract String getType();

    public String toFileString() {
        return reviewId + "|" + customerId + "|" + roomNumber + "|" + rating + "|"
                + title.replace("|", "/") + "|" + comment.replace("|", "/") + "|"
                + date + "|" + approved + "|" + getType();
    }

    protected String stars() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) sb.append(i < rating ? "★" : "☆");
        return sb.toString();
    }
}
