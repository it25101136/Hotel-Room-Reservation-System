package services;

import models.PublicReview;
import models.Review;
import models.VerifiedReview;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 06 — Review Management Service.
 *
 * Features:
 * - Submit reviews (public & verified)
 * - Load and persist reviews from/to file (reviews.txt)
 * - Retrieve, update, approve, delete reviews
 * - Calculate average rating
 *
 * Demonstrates:
 * - Polymorphism (handling different Review types)
 * - Encapsulation (private list)
 * - File persistence
 *
 * Author: Member 5
 */
public class ReviewService {

    // File where reviews are stored
    private static final String FILE_NAME = "reviews.txt";

    // In-memory storage of all reviews
    private final List<Review> reviews = new ArrayList<>();

    // Auto-increment ID for reviews
    private int nextId = 1;

    /**
     * Constructor — loads reviews from file on startup.
     */
    public ReviewService() {
        loadFromFile();
    }

    /**
     * Loads reviews from file into memory.
     */
    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Review r = parse(line);
            if (r != null) {
                reviews.add(r);

                // Ensure unique ID generation
                if (r.getReviewId() >= nextId)
                    nextId = r.getReviewId() + 1;
            }
        }
    }

    /**
     * Parses a line from file into Review object.
     * Supports both PublicReview and VerifiedReview.
     */
    private Review parse(String line) {
        String[] p = line.split("\\|");

        if (p.length < 9) return null;

        try {
            int id     = Integer.parseInt(p[0]);
            int cId    = Integer.parseInt(p[1]);
            int rn     = Integer.parseInt(p[2]);
            int rate   = Integer.parseInt(p[3]);
            String t   = p[4];
            String cm  = p[5];
            String dt  = p[6];
            boolean ap = Boolean.parseBoolean(p[7]);
            String type = p[8];

            // VERIFIED review handling
            if (type.equals("VERIFIED") && p.length >= 10) {
                int resId = Integer.parseInt(p[9]);
                return new VerifiedReview(id, cId, rn, rate, t, cm, dt, ap, resId);
            }

            // Default is PublicReview
            return new PublicReview(id, cId, rn, rate, t, cm, dt, ap);

        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Saves all reviews back to file.
     */
    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Review r : reviews)
            lines.add(r.toFileString());

        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD OPERATIONS ============

    /**
     * Submit a public review (not verified).
     */
    public Review submitPublicReview(int custId, int roomNum, int rating,
                                     String title, String comment, String date) {

        PublicReview r = new PublicReview(
                nextId++, custId, roomNum, rating, title, comment, date, false
        );

        reviews.add(r);
        persist();
        return r;
    }

    /**
     * Submit a verified review (linked to reservation).
     */
    public Review submitVerifiedReview(int custId, int roomNum, int rating,
                                       String title, String comment, String date, int reservationId) {

        VerifiedReview r = new VerifiedReview(
                nextId++, custId, roomNum, rating, title, comment, date, true, reservationId
        );

        reviews.add(r);
        persist();
        return r;
    }

    /**
     * Returns all reviews (both approved and unapproved).
     */
    public List<Review> getAll() {
        return new ArrayList<>(reviews);
    }

    /**
     * Returns only approved reviews.
     */
    public List<Review> getApproved() {
        List<Review> list = new ArrayList<>();
        for (Review r : reviews)
            if (r.isApproved())
                list.add(r);

        return list;
    }

    /**
     * Returns approved reviews for a specific room.
     */
    public List<Review> getByRoom(int roomNumber) {
        List<Review> list = new ArrayList<>();
        for (Review r : reviews)
            if (r.getRoomNumber() == roomNumber && r.isApproved())
                list.add(r);

        return list;
    }

    /**
     * Get review by ID.
     */
    public Review getById(int id) {
        for (Review r : reviews)
            if (r.getReviewId() == id)
                return r;

        return null;
    }

    /**
     * Update review details (rating, title, comment).
     */
    public boolean updateReview(int id, Integer rating, String title, String comment) {
        Review r = getById(id);
        if (r == null) return false;

        if (rating != null) r.setRating(rating);
        if (title != null && !title.isEmpty()) r.setTitle(title);
        if (comment != null && !comment.isEmpty()) r.setComment(comment);

        persist();
        return true;
    }

    /**
     * Approve or reject a review.
     */
    public boolean setApproval(int id, boolean approved) {
        Review r = getById(id);
        if (r == null) return false;

        r.setApproved(approved);
        persist();
        return true;
    }

    /**
     * Delete a review permanently.
     */
    public boolean deleteReview(int id) {
        boolean removed = reviews.removeIf(r -> r.getReviewId() == id);

        if (removed)
            persist();

        return removed;
    }

    /**
     * Calculates average rating of all approved reviews.
     */
    public double averageRating() {
        List<Review> approved = getApproved();

        if (approved.isEmpty())
            return 0.0;

        double sum = 0;
        for (Review r : approved)
            sum += r.getRating();

        return sum / approved.size();
    }
}