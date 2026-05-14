package services;

import models.PublicReview;
import models.Review;
import models.VerifiedReview;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 06 — Review Management Service.
 * Persists to reviews.txt
 * Author: Member 5
 */
public class ReviewService {
    private static final String FILE_NAME = "reviews.txt";
    private final List<Review> reviews = new ArrayList<>();
    private int nextId = 1;

    public ReviewService() { loadFromFile(); }

    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Review r = parse(line);
            if (r != null) {
                reviews.add(r);
                if (r.getReviewId() >= nextId) nextId = r.getReviewId() + 1;
            }
        }
    }

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
            if (type.equals("VERIFIED") && p.length >= 10) {
                int resId = Integer.parseInt(p[9]);
                return new VerifiedReview(id, cId, rn, rate, t, cm, dt, ap, resId);
            }
            return new PublicReview(id, cId, rn, rate, t, cm, dt, ap);
        } catch (Exception e) { return null; }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Review r : reviews) lines.add(r.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    public Review submitPublicReview(int custId, int roomNum, int rating,
                                     String title, String comment, String date) {
        PublicReview r = new PublicReview(nextId++, custId, roomNum, rating, title, comment, date, false);
        reviews.add(r); persist(); return r;
    }

    public Review submitVerifiedReview(int custId, int roomNum, int rating,
                                       String title, String comment, String date, int reservationId) {
        VerifiedReview r = new VerifiedReview(nextId++, custId, roomNum, rating, title, comment, date, true, reservationId);
        reviews.add(r); persist(); return r;
    }

    public List<Review> getAll() { return new ArrayList<>(reviews); }

    public List<Review> getApproved() {
        List<Review> list = new ArrayList<>();
        for (Review r : reviews) if (r.isApproved()) list.add(r);
        return list;
    }

    public List<Review> getByRoom(int roomNumber) {
        List<Review> list = new ArrayList<>();
        for (Review r : reviews)
            if (r.getRoomNumber() == roomNumber && r.isApproved()) list.add(r);
        return list;
    }

    public Review getById(int id) {
        for (Review r : reviews) if (r.getReviewId() == id) return r;
        return null;
    }

    public boolean updateReview(int id, Integer rating, String title, String comment) {
        Review r = getById(id);
        if (r == null) return false;
        if (rating != null) r.setRating(rating);
        if (title != null && !title.isEmpty()) r.setTitle(title);
        if (comment != null && !comment.isEmpty()) r.setComment(comment);
        persist(); return true;
    }

    public boolean setApproval(int id, boolean approved) {
        Review r = getById(id);
        if (r == null) return false;
        r.setApproved(approved);
        persist(); return true;
    }

    public boolean deleteReview(int id) {
        boolean removed = reviews.removeIf(r -> r.getReviewId() == id);
        if (removed) persist();
        return removed;
    }

    public double averageRating() {
        List<Review> approved = getApproved();
        if (approved.isEmpty()) return 0.0;
        double sum = 0;
        for (Review r : approved) sum += r.getRating();
        return sum / approved.size();
    }
}
