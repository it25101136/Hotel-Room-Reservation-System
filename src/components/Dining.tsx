import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";
import { useBooking } from "../context/BookingContext";

export default function Dining() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { addToast } = useToast();
  const { openBooking } = useBooking();

  const handleReservation = () => {
    addToast("Opening dining reservation page...", "info");
    openBooking({
      purpose: "Dining Reservation",
      packageName: "Signature Restaurant Table Reservation",
      serviceName: "Fine Dining Experience",
      guests: 2,
      rooms: 1,
    });
  };

  const handleViewMenu = () => {
    addToast("Opening dining inquiry page...", "info");
    openBooking({
      purpose: "Dining Menu Request",
      packageName: "Michelin-Starred Signature Menu",
      serviceName: "Menu Consultation",
      guests: 2,
      rooms: 1,
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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="dining" ref={ref} className="relative py-20 md:py-32 bg-dark-300 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={`order-2 lg:order-1 transition-all duration-1000 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-gold-500 text-sm uppercase tracking-[0.3em] font-medium">
              Fine Dining
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark-400 font-bold mt-4 mb-6 leading-tight">
              A Culinary Journey
              <span className="block text-gold-500">of Distinction</span>
            </h2>
            <div className="w-16 h-[2px] bg-gold-400 mb-8" />

            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Experience gastronomic excellence at our signature restaurant,
                helmed by world-renowned Chef Marcus Bellamy. Each dish is a
                masterpiece, crafted from the finest seasonal ingredients sourced
                from around the globe.
              </p>
              <p>
                Our wine cellar boasts over 2,000 labels from the world&apos;s most
                prestigious vineyards, curated by our master sommelier. From
                intimate dinners to celebratory feasts, every meal at Aurum is an
                unforgettable experience.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center p-4 bg-dark-400 border border-gold-500/20 rounded-sm">
                <div className="font-display text-2xl font-bold text-gold-500">2</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">Michelin Stars</div>
              </div>
              <div className="text-center p-4 bg-dark-400 border border-gold-500/20 rounded-sm">
                <div className="font-display text-2xl font-bold text-gold-500">3</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">Dining Venues</div>
              </div>
              <div className="text-center p-4 bg-dark-400 border border-gold-500/20 rounded-sm">
                <div className="font-display text-2xl font-bold text-gold-500">2K+</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">Wine Labels</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button
                onClick={handleReservation}
                className="group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-sm px-8 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
              >
                Make a Reservation
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleViewMenu}
                className="group inline-flex items-center justify-center gap-2 border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 font-semibold uppercase tracking-widest text-sm px-8 py-3.5 transition-all duration-300"
              >
                View Menu
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            className={`order-1 lg:order-2 relative transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(/images/dining.jpg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Floating badge */}
              <div className="absolute top-6 left-6 bg-gold-500 text-black px-6 py-3">
                <div className="text-xs uppercase tracking-widest font-medium">Awarded</div>
                <div className="font-display text-xl font-bold">2 Michelin Stars</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
