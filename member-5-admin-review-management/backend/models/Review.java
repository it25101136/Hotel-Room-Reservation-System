package models;

/**
 * Component 06 — Review Management
 *
 * This is an abstract class representing a generic Review in the system.
 *
 * It demonstrates key OOP concepts:
 * - Encapsulation (private fields with getters/setters)
 * - Inheritance (extended by PublicReview and other review types)
 * - Abstraction (abstract methods for different review behaviors)
 *
 * Author: Member 5
 */
public abstract class Review {

    // Unique identifier for each review
    private int reviewId;

    // ID of the customer who submitted the review
    private int customerId;

    // Room number being reviewed
    private int roomNumber;

    // Rating given by customer (1 to 5)
    private int rating;

    // Title of the review
    private String title;

    // Detailed review comment
    private String comment;

    // Date of review submission (format: YYYY-MM-DD)
    private String date;

    // Whether the review is approved by admin or not
    private boolean approved;

    /**
     * Constructor to initialize all review attributes.
     */
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

    // Getter and Setter methods for encapsulated fields

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

    /**
     * Abstract method — must be implemented by child classes.
     * Defines how review is shown to customers.
     */
    public abstract String displayForCustomer();

    /**
     * Abstract method — must be implemented by child classes.
     * Defines how review is shown to admins.
     */
    public abstract String displayForAdmin();

    /**
     * Abstract method — returns type of review (PUBLIC / VERIFIED).
     */
    public abstract String getType();

    /**
     * Converts review object into a string format for file storage.
     * Used when saving review data into text files.
     */
    public String toFileString() {
        return reviewId + "|" + customerId + "|" + roomNumber + "|" + rating + "|"
                + title.replace("|", "/") + "|" + comment.replace("|", "/") + "|"
                + date + "|" + approved + "|" + getType();
    }

    /**
     * Utility method to convert numeric rating into star format.
     * Example: 4 → ★★★★☆
     */
    protected String stars() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) sb.append(i < rating ? "★" : "☆");
        return sb.toString();
    }
}