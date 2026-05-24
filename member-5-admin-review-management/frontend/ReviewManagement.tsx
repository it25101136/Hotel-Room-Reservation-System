import { useState } from "react";
import "../styles/review-management.css";

/**
 * Member 5 (Part 2) — Review Management Component
 * Tabs: View Reviews | Submit Review | Admin Moderation
 */

type ReviewType = "PUBLIC" | "VERIFIED";

interface Review {
  id: number;
  customerId: number;
  customerName: string;
  roomNumber: number;
  rating: number;       // 1-5
  title: string;
  comment: string;
  date: string;         // YYYY-MM-DD
  approved: boolean;
  type: ReviewType;
  reservationId?: number;
}

const seed: Review[] = [
  { id: 1, customerId: 1, customerName: "Amal Perera",  roomNumber: 101, rating: 5, title: "Absolutely stunning!",  comment: "Best stay I've ever had at the Galle Face. Service was impeccable.", date: "2026-01-15", approved: true,  type: "VERIFIED", reservationId: 1001 },
  { id: 2, customerId: 2, customerName: "Nimali Silva", roomNumber: 201, rating: 5, title: "Royal treatment",       comment: "The Executive Suite exceeded all expectations.",                  date: "2026-01-20", approved: true,  type: "VERIFIED", reservationId: 1002 },
  { id: 3, customerId: 3, customerName: "Kasun F.",     roomNumber: 301, rating: 4, title: "Very good experience",  comment: "Loved the spa and dining options.",                                date: "2026-02-01", approved: false, type: "PUBLIC" },
];

type Tab = "view" | "submit" | "moderate";
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>(seed);
  const [tab, setTab] = useState<Tab>("view");

  // CREATE
  const [form, setForm] = useState({
    roomNumber: 101, rating: 5, title: "", comment: "", customerName: "", verified: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Review = {
      id: Math.max(...reviews.map(r => r.id), 0) + 1,
      customerId: 99,
      customerName: form.customerName || "Anonymous Guest",
      roomNumber: form.roomNumber,
      rating: form.rating,
      title: form.title,
      comment: form.comment,
      date: new Date().toISOString().slice(0, 10),
      approved: form.verified,
      type: form.verified ? "VERIFIED" : "PUBLIC",
    };
    setReviews([next, ...reviews]);
    alert(`✓ Review submitted (${next.type}).`);
    setForm({ roomNumber: 101, rating: 5, title: "", comment: "", customerName: "", verified: false });
    setTab("view");
  };

  // UPDATE — approve / reject
  const setApproved = (id: number, approved: boolean) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (!confirm(`Delete review #${id}?`)) return;
    setReviews(reviews.filter(r => r.id !== id));
  };

  const approved = reviews.filter(r => r.approved);
  const pending = reviews.filter(r => !r.approved);
  const avgRating = approved.length > 0
    ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
    : "0.0";

  return (
    <section className="rev-mgmt">
      <h1 className="rev-mgmt__title">Review Management</h1>
      <p className="rev-mgmt__subtitle">Component 06 · Inheritance + Polymorphism</p>

      <nav className="rev-tabs">
        <button className={`rev-tab ${tab==="view"?"rev-tab--active":""}`} onClick={() => setTab("view")}>View Reviews</button>
        <button className={`rev-tab ${tab==="submit"?"rev-tab--active":""}`} onClick={() => setTab("submit")}>Submit Review</button>
        <button className={`rev-tab ${tab==="moderate"?"rev-tab--active":""}`} onClick={() => setTab("moderate")}>Admin Moderation ({pending.length})</button>
      </nav>

      {/* === VIEW === */}
      {tab === "view" && (
        <>
          <div className="rev-avg">
            <div className="rev-avg__num">{avgRating}</div>
            <div className="rev-avg__stars">{stars(Math.round(parseFloat(avgRating)))}</div>
            <div className="rev-avg__count">{approved.length} approved review{approved.length === 1 ? "" : "s"}</div>
          </div>
          <div className="rev-grid">
            {approved.map(r => (
              <article key={r.id} className={`rev-card ${r.type === "VERIFIED" ? "rev-card--verified" : ""}`}>
                <div className="rev-card__header">
                  <div className="rev-card__user">
                    <div className="rev-card__avatar">{r.customerName.charAt(0)}</div>
                    <div>
                      <div className="rev-card__name">{r.customerName}</div>
                      <div className="rev-card__date">{r.date}</div>
                    </div>
                  </div>
                </div>
                <div className="rev-card__stars">{stars(r.rating)}</div>
                <h3 className="rev-card__title">{r.title}</h3>
                <p className="rev-card__text">"{r.comment}"</p>
                <span className="rev-card__room">Room #{r.roomNumber}</span>
              </article>
            ))}
          </div>
        </>
      )}

      {/* === SUBMIT === */}
      {tab === "submit" && (
        <form className="rev-form" onSubmit={handleSubmit}>
          <div className="rev-form__field">
            <label className="rev-form__label">Your Name</label>
            <input className="rev-form__input" required
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })} />
          </div>
          <div className="rev-form__field">
            <label className="rev-form__label">Room Number</label>
            <input className="rev-form__input" type="number" required
              value={form.roomNumber}
              onChange={e => setForm({ ...form, roomNumber: parseInt(e.target.value, 10) || 0 })} />
          </div>
          <div className="rev-form__field">
            <label className="rev-form__label">Your Rating</label>
            <div className="rev-form__star-input">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n} type="button"
                  className={`rev-form__star ${n <= form.rating ? "rev-form__star--active" : ""}`}
                  onClick={() => setForm({ ...form, rating: n })}>★</button>
              ))}
            </div>
          </div>
          <div className="rev-form__field">
            <label className="rev-form__label">Review Title</label>
            <input className="rev-form__input" required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="rev-form__field">
            <label className="rev-form__label">Comment</label>
            <textarea className="rev-form__textarea" rows={5} required
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })} />
          </div>
          <div className="rev-form__field">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ccc" }}>
              <input type="checkbox" checked={form.verified}
                onChange={e => setForm({ ...form, verified: e.target.checked })} />
              I have a confirmed reservation (VERIFIED review — auto-approved)
            </label>
          </div>
          <button className="rev-form__btn" type="submit">Submit Review</button>
        </form>
      )}

      {/* === MODERATE === */}
      {tab === "moderate" && (
        pending.length === 0 && reviews.length === 0
          ? <p style={{ textAlign: "center", color: "#999" }}>No reviews to moderate.</p>
          : (
            <div className="rev-grid">
              {reviews.map(r => (
                <article key={r.id} className={`rev-card ${!r.approved ? "rev-card--pending" : ""} ${r.type==="VERIFIED" ? "rev-card--verified" : ""}`}>
                  <div className="rev-card__header">
                    <div className="rev-card__user">
                      <div className="rev-card__avatar">{r.customerName.charAt(0)}</div>
                      <div>
                        <div className="rev-card__name">{r.customerName}</div>
                        <div className="rev-card__date">#{r.id} · {r.date} · {r.type}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rev-card__stars">{stars(r.rating)}</div>
                  <h3 className="rev-card__title">{r.title}</h3>
                  <p className="rev-card__text">"{r.comment}"</p>
                  <span className="rev-card__room">Room #{r.roomNumber}</span>
                  <div className="rev-card__actions">
                    {!r.approved
                      ? <button className="rev-card__btn rev-card__btn--ok" onClick={() => setApproved(r.id, true)}>Approve</button>
                      : <button className="rev-card__btn" onClick={() => setApproved(r.id, false)}>Unapprove</button>
                    }
                    <button className="rev-card__btn rev-card__btn--del" onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )
      )}
    </section>
  );
}
