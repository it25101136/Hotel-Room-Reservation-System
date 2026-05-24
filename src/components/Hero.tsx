import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/hero-bg.jpg",
    title: "Experience Timeless Luxury",
    subtitle: "Where elegance meets perfection",
  },
  {
    image: "/images/presidential-suite.jpg",
    title: "World-Class Accommodations",
    subtitle: "Indulge in the finest suites",
  },
  {
    image: "/images/dining.jpg",
    title: "Gastronomic Excellence",
    subtitle: "A culinary journey awaits",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen overflow-hidden"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            transform: `scale(${currentSlide === index ? 1 : 1.1})`,
            transition: "opacity 1.5s ease-in-out, transform 1.5s ease-in-out",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div
          className={`transition-all duration-1000 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Gold divider with animation */}
          <div className="flex items-center justify-center gap-4 mb-6 group">
            <div className="w-12 h-[1px] bg-gold-400/60 group-hover:w-20 transition-all duration-500" />
            <span className="text-gold-400 text-sm uppercase tracking-[0.3em] font-light animate-pulse">
              AURUM HOTEL
            </span>
            <div className="w-12 h-[1px] bg-gold-400/60 group-hover:w-20 transition-all duration-500" />
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-bold mb-6 tracking-tight leading-none">
            <span className="gold-shimmer hover:scale-105 transition-transform duration-500 inline-block">AURUM</span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light mb-4 tracking-wide">
            {slides[currentSlide].title}
          </p>
          <p className="text-base sm:text-lg text-gray-400 mb-12 tracking-widest uppercase">
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#rooms"
              className="group relative overflow-hidden bg-gold-500 text-black font-semibold px-10 py-4 text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-1 btn-shine"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Rooms
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
            <a
              href="#gallery"
              className="group relative overflow-hidden border border-white/30 text-white font-semibold px-10 py-4 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Gallery
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold-400/60 to-transparent animate-float" />
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              currentSlide === index
                ? "w-12 h-[2px] bg-gold-400"
                : "w-8 h-[2px] bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
