package services;

import models.PublicReview;
import models.Review;
import models.VerifiedReview;
import utils.FileHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Component 06: Review Management Service
 * Persists to reviews.txt
 */
public class ReviewService {
    private static final String FILE_NAME = "reviews.txt";
    private final List<Review> reviews = new ArrayList<>();
    private int nextId = 1;

    public ReviewService() {
        loadFromFile();
    }

    private void loadFromFile() {
        List<String> lines = FileHandler.readAllLines(FILE_NAME);
        for (String line : lines) {
            Review r = parseReview(line);
            if (r != null) {
                reviews.add(r);
                if (r.getReviewId() >= nextId) nextId = r.getReviewId() + 1;
            }
        }
    }

    private Review parseReview(String line) {
        String[] p = line.split("\\|");
        if (p.length < 9) return null;
        try {
            int id = Integer.parseInt(p[0]);
            int custId = Integer.parseInt(p[1]);
            int roomNo = Integer.parseInt(p[2]);
            int rating = Integer.parseInt(p[3]);
            String title = p[4], comment = p[5], date = p[6];
            boolean approved = Boolean.parseBoolean(p[7]);
            String type = p[8];
            if (type.equals("VERIFIED") && p.length >= 10) {
                int resId = Integer.parseInt(p[9]);
                return new VerifiedReview(id, custId, roomNo, rating, title, comment, date, approved, resId);
            }
            return new PublicReview(id, custId, roomNo, rating, title, comment, date, approved);
        } catch (Exception e) {
            return null;
        }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Review r : reviews) lines.add(r.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE: Submit a public review */
    public Review submitPublicReview(int customerId, int roomNumber, int rating,
                                     String title, String comment, String date) {
        PublicReview r = new PublicReview(nextId++, customerId, roomNumber, rating,
                title, comment, date, false);
        reviews.add(r);
        persist();
        return r;
    }

    /** CREATE: Submit a verified review (proves stay via reservation) */
    public Review submitVerifiedReview(int customerId, int roomNumber, int rating,
                                       String title, String comment, String date, int reservationId) {
        VerifiedReview r = new VerifiedReview(nextId++, customerId, roomNumber, rating,
                title, comment, date, true, reservationId); // verified reviews auto-approved
        reviews.add(r);
        persist();
        return r;
    }

    /** READ: All reviews */
    public List<Review> getAll() { return new ArrayList<>(reviews); }

    /** READ: Approved reviews only (for public display) */
    public List<Review> getApproved() {
        List<Review> list = new ArrayList<>();
        for (Review r : reviews) if (r.isApproved()) list.add(r);
        return list;
    }

    /** READ: Reviews for a specific room */
    public List<Review> getByRoom(int roomNumber) {
        List<Review> list = new ArrayList<>();
        for (Review r : reviews)
            if (r.getRoomNumber() == roomNumber && r.isApproved()) list.add(r);
        return list;
    }

    public Review getById(int reviewId) {
        for (Review r : reviews) if (r.getReviewId() == reviewId) return r;
        return null;
    }

    /** UPDATE: Edit a review */
    public boolean updateReview(int reviewId, Integer rating, String title, String comment) {
        Review r = getById(reviewId);
        if (r == null) return false;
        if (rating != null) r.setRating(rating);
        if (title != null && !title.isEmpty()) r.setTitle(title);
        if (comment != null && !comment.isEmpty()) r.setComment(comment);
        persist();
        return true;
    }

    /** Admin moderation: Approve / reject */
    public boolean setApproval(int reviewId, boolean approved) {
        Review r = getById(reviewId);
        if (r == null) return false;
        r.setApproved(approved);
        persist();
        return true;
    }

    /** DELETE: Remove inappropriate or outdated reviews */
    public boolean deleteReview(int reviewId) {
        boolean removed = reviews.removeIf(r -> r.getReviewId() == reviewId);
        if (removed) persist();
        return removed;
    }

    /** Average rating across all approved reviews */
    public double averageRating() {
        List<Review> approved = getApproved();
        if (approved.isEmpty()) return 0.0;
        double sum = 0;
        for (Review r : approved) sum += r.getRating();
        return sum / approved.size();
    }
}
