import { useEffect, useRef, useState } from "react";
import StatsSection from "./StatsCounter";
import { useToast } from "./Toast";
import { useVirtualTour } from "../context/VirtualTourContext";

export default function About() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { addToast } = useToast();
  const { openTour } = useVirtualTour();

  const handleDiscoverMore = () => {
    addToast("Loading our story...", "info");
    document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVirtualTour = () => {
    addToast("Opening immersive 360° virtual tour...", "info");
    openTour("lobby");
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
    <section id="about" ref={ref} className="relative bg-dark-400 overflow-hidden">
      {/* Decorative gold accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold-50 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold-50 to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image collage */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Main image */}
              <div
                className="absolute inset-0 rounded-sm overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url(/images/hero-bg.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-dark-400 shadow-2xl border border-gold-500/30 p-6 md:p-8 max-w-[200px] md:max-w-[240px]">
                <div className="font-display text-3xl md:text-4xl font-bold text-gold-500 mb-1">
                  5 Star
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">
                  Luxury Hotel
                </div>
                <div className="mt-3 w-10 h-[2px] bg-gold-400" />
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Awarded the highest rating for exceptional service
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-gold-500 text-sm uppercase tracking-[0.3em] font-medium">
              About Aurum
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark-400 font-bold mt-4 mb-6 leading-tight">
              Where Every Moment
              <span className="block text-gold-500">Becomes a Memory</span>
            </h2>
            <div className="w-16 h-[2px] bg-gold-400 mb-8" />

            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Nestled along the pristine Galle Face coastline in Colombo, Aurum Hotel
                stands as a beacon of unparalleled luxury and sophisticated elegance.
                From the moment you step through our marble-clad entrance, you are
                enveloped in an atmosphere of timeless refinement.
              </p>
              <p>
                Each of our 128 meticulously designed rooms and suites tells a story
                of craftsmanship and attention to detail. Our world-class
                restaurant, curated by Michelin-starred chefs, offers a gastronomic
                journey that celebrates the finest seasonal ingredients.
              </p>
              <p>
                At Aurum, we believe true luxury lies in the details &mdash; from the
                fresh orchids in your suite to the personalized butler service that
                anticipates your every desire. Experience a world where tradition
                meets modernity, and every guest is treated as royalty.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 mt-10">
              <div>
                <div className="font-display text-3xl font-bold text-white">128</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Luxury Rooms</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-white">5</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Dining Venues</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Concierge</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button
                onClick={handleDiscoverMore}
                className="group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-sm px-8 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
              >
                Discover More
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleVirtualTour}
                className="group inline-flex items-center justify-center gap-2 border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 font-semibold uppercase tracking-widest text-sm px-8 py-3.5 transition-all duration-300"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                Virtual Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      <StatsSection />
    </section>
  );
}
