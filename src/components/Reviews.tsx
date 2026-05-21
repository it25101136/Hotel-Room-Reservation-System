import { useState, useRef } from "react";
import { useToast } from "./Toast";

interface Review {
  id: number;
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Michael Thompson",
    rating: 5,
    title: "Absolutely Stunning Experience",
    text: "Our stay at Aurum was nothing short of perfection. The Presidential Suite exceeded all expectations with its breathtaking views and impeccable service. The spa treatments were divine, and the dining experience at their signature restaurant was a culinary journey we'll never forget.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    rating: 5,
    title: "World-Class Luxury",
    text: "From the moment we arrived, we were treated like royalty. The staff anticipated our every need, the rooms were immaculate, and the location along Galle Face is perfect. The infinity pool with city views is a must-visit!",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: 3,
    name: "James Wilson",
    rating: 4,
    title: "Exceptional Service",
    text: "The Executive Suite was beautifully appointed with stunning city views. The concierge team was incredibly helpful with restaurant reservations and tour arrangements. Only minor suggestion would be to extend the spa hours.",
    date: "2024-01-05",
    verified: true,
  },
];

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(i + 1)}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
        >
          <svg
            className={`w-5 h-5 ${i < rating ? "text-gold-400" : "text-gray-600"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [formData, setFormData] = useState({ name: "", title: "", text: "" });
  const ref = useRef<HTMLElement>(null);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      addToast("Please select a rating", "error");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      name: formData.name,
      rating: newRating,
      title: formData.title,
      text: formData.text,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    };

    setReviews([newReview, ...reviews]);
    setFormData({ name: "", title: "", text: "" });
    setNewRating(0);
    setShowForm(false);
    addToast("Thank you! Your review has been submitted.", "success");
  };

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-dark-400 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm uppercase tracking-[0.3em] font-medium">
            Guest Reviews
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-4 mb-4">
            What Our Guests Say
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />

          {/* Average Rating */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-gold-400">{averageRating.toFixed(1)}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">Average Rating</div>
            </div>
            <div className="text-left">
              <StarRating rating={Math.round(averageRating)} />
              <div className="text-gray-400 text-sm mt-2">{reviews.length} reviews</div>
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="group relative overflow-hidden inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 btn-shine"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-16 bg-dark-300 border border-gold-500/30 rounded-sm p-8 animate-[scaleIn_0.3s_ease-out] shadow-2xl shadow-gold-500/10">
            <h3 className="font-display text-2xl text-white font-bold mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Your Rating
                </label>
                <StarRating rating={newRating} interactive onRate={setNewRating} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-dark-400 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-dark-400 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none text-sm"
                  placeholder="Summarize your experience"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Review *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-dark-400 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none text-sm resize-none"
                  placeholder="Share your experience with us..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-4 uppercase tracking-widest text-sm transition-all duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group bg-dark-300 border border-gray-700 rounded-sm p-6 hover:border-gold-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold-500/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center">
                    <span className="font-display font-bold text-gold-400">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{review.name}</div>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-xs text-gold-400">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Verified Guest
                      </div>
                    )}
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <h4 className="font-display text-lg text-white font-bold mb-2">{review.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{review.text}</p>
              <div className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
