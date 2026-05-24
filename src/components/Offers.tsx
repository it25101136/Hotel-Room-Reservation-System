import { useEffect, useRef, useState } from "react";
import type { Offer } from "../types";
import { useBooking } from "../context/BookingContext";

const offers: Offer[] = [
  {
    id: 1,
    title: "Romantic Getaway",
    description: "Escape with your loved one to a world of romance. Includes champagne on arrival, couples spa treatment, and candlelit dinner.",
    price: "LKR 420,000",
    originalPrice: "LKR 620,000",
    image: "/images/dining.jpg",
    features: ["Champagne welcome", "Couples massage", "Candlelit dinner", "Late checkout"],
  },
  {
    id: 2,
    title: "Business Elite Package",
    description: "The ultimate business travel experience with executive lounge access, airport transfers, and dedicated meeting spaces.",
    price: "LKR 290,000",
    originalPrice: "LKR 420,000",
    image: "/images/executive-suite.jpg",
    features: ["Airport transfer", "Executive lounge", "Meeting room", "Express checkout"],
  },
  {
    id: 3,
    title: "Spa & Stay Retreat",
    description: "Rejuvenate with our all-inclusive spa package. Enjoy daily treatments, healthy cuisine, and unlimited pool access.",
    price: "LKR 520,000",
    originalPrice: "LKR 720,000",
    image: "/images/spa.jpg",
    features: ["Daily spa treatment", "Wellness cuisine", "Pool access", "Yoga sessions"],
  },
];

export default function Offers() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();

  const handleBookOffer = (offer: Offer) => {
    const numericPrice = parseInt(offer.price.replace(/[^\d]/g, ""), 10) || 0;
    openBooking({
      packageName: offer.title,
      roomPrice: numericPrice,
    });
  };

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

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-gradient-to-b from-dark-300 to-dark-400 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-500 text-sm uppercase tracking-[0.3em] font-medium">
            Special Offers
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark-400 font-bold mt-4 mb-4">
            Exclusive Packages
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
            Curated experiences designed to make your stay truly unforgettable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className={`group bg-dark-400 shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${offer.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-gold-500 text-black text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                  Save {Math.round(
                    ((parseInt(offer.originalPrice.replace(/[^0-9]/g, "")) -
                      parseInt(offer.price.replace(/[^0-9]/g, ""))) /
                      parseInt(offer.originalPrice.replace(/[^0-9]/g, ""))) *
                      100
                  )}
                  %
                </div>
                {/* Price */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{offer.price}</span>
                    <span className="text-sm text-gray-300 line-through">{offer.originalPrice}</span>
                  </div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">per night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl text-white font-bold mb-3 group-hover:text-gold-500 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {offer.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {offer.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs text-gold-400 bg-gold-500/20 px-3 py-1.5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleBookOffer(offer)}
                  className="w-full bg-dark-400 hover:bg-gold-500 text-white hover:text-black font-semibold py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
                >
                  Book This Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
