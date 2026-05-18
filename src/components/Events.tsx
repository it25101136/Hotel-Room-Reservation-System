import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";
import { useBooking } from "../context/BookingContext";

const events = [
  {
    id: 1,
    title: "Grand Ballroom",
    capacity: "500 guests",
    image: "/images/gallery-4.jpg",
    description: "Our magnificent ballroom with crystal chandeliers, perfect for weddings, galas, and corporate events.",
    features: ["Crystal chandeliers", "Marble dance floor", "Built-in AV system", "Dedicated event coordinator"],
  },
  {
    id: 2,
    title: "Rooftop Terrace",
    capacity: "200 guests",
    image: "/images/pool.jpg",
    description: "Stunning rooftop venue with panoramic city views, ideal for cocktail receptions and outdoor celebrations.",
    features: ["City skyline views", "Sunset ceremonies", "Full bar service", "Weather backup"],
  },
  {
    id: 3,
    title: "Private Dining Room",
    capacity: "50 guests",
    image: "/images/dining.jpg",
    description: "Intimate setting for exclusive dinners, business meetings, and private celebrations.",
    features: ["Personal chef", "Custom menus", "Wine pairing", "Private entrance"],
  },
];

export default function Events() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { addToast } = useToast();
  const { openBooking } = useBooking();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleInquire = (event: typeof events[0]) => {
    addToast(`Opening inquiry for ${event.title}...`, "info");
    openBooking({
      purpose: "Event Venue Inquiry",
      eventName: event.title,
      packageName: `${event.title} · ${event.capacity}`,
      guests: parseInt(event.capacity.replace(/[^\d]/g, ""), 10) || 50,
      rooms: 1,
    });
  };

  const handleWeddingBrochure = () => {
    addToast("Opening wedding consultation page...", "info");
    openBooking({
      purpose: "Wedding Consultation Request",
      eventName: "Wedding & Celebrations",
      packageName: "Luxury Wedding Brochure Request",
      guests: 120,
      rooms: 1,
    });
  };

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-dark-400 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm uppercase tracking-[0.3em] font-medium">
            Events & Celebrations
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-4 mb-4">
            Unforgettable Occasions
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Create lasting memories in our world-class event spaces
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold-400/50 transition-all duration-700 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-2 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="text-gold-400 text-sm uppercase tracking-wider">{event.capacity}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl text-white font-bold mb-2 group-hover:text-gold-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="text-xs text-gray-400 border border-white/10 px-2 py-1">
                      {feature}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleInquire(event)}
                  className="w-full border border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-black font-semibold py-3 text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Inquire Now
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wedding CTA */}
        <div className="mt-16 p-8 md:p-12 bg-gradient-to-r from-gold-500/10 to-gold-400/10 border border-gold-400/30 rounded-sm text-center">
          <h3 className="font-display text-2xl md:text-3xl text-white font-bold mb-4">
            Planning Your Dream Wedding?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Let our dedicated wedding team create a celebration as unique as your love story.
            From intimate ceremonies to grand receptions, we handle every detail.
          </p>
          <button
            onClick={handleWeddingBrochure}
            className="bg-gold-500 hover:bg-gold-400 text-black font-semibold px-10 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
          >
            Request Wedding Brochure
          </button>
        </div>
      </div>
    </section>
  );
}
