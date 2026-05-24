import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";

const galleryImages = [
  { src: "/images/gallery-1.jpg",       title: "Grand Entrance",       category: "Architecture" },
  { src: "/images/gallery-2.jpg",       title: "Rooftop Bar",           category: "Dining" },
  { src: "/images/deluxe-room.jpg",     title: "Deluxe Room",           category: "Rooms" },
  { src: "/images/pool.jpg",            title: "Infinity Pool",         category: "Leisure" },
  { src: "/images/dining.jpg",          title: "Signature Restaurant",  category: "Dining" },
  { src: "/images/spa.jpg",             title: "Spa Sanctuary",         category: "Spa" },
];

const categories = ["All", "Architecture", "Rooms", "Dining", "Leisure", "Spa"];

export default function Gallery() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { addToast } = useToast();

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

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight" && lightboxIndex !== null)
        setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
      if (e.key === "ArrowLeft" && lightboxIndex !== null)
        setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filter]);

  const filteredImages =
    filter === "All" ? galleryImages : galleryImages.filter((g) => g.category === filter);

  const handleFilter = (cat: string) => {
    setFilter(cat);
    addToast(`Showing ${cat === "All" ? "all photos" : cat + " photos"}`, "info");
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative py-20 md:py-32 bg-dark-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-sm uppercase tracking-[0.3em] font-medium">
            Gallery
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-4 mb-4">
            A Visual Journey
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Explore the elegance and beauty of Aurum through our curated gallery
          </p>
        </div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
                filter === cat
                  ? "bg-gold-500 text-black border-gold-500"
                  : "bg-transparent text-gold-400 border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredImages.map((item, index) => (
            <button
              type="button"
              key={item.title}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-700 text-left ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              aria-label={`View ${item.title} in lightbox`}
            >
              <div className="relative h-72 md:h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.src})` }}
                />
                <div
                  className={`absolute inset-0 bg-dark-400/70 transition-all duration-500 flex items-center justify-center ${
                    activeIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="text-center transform transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                    <div className="w-12 h-12 rounded-full border-2 border-gold-400 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                    <h3 className="text-white font-display text-xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <span className="text-gold-400 text-xs uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <p className="text-center text-gray-500 py-12">No photos in this category yet.</p>
        )}
      </div>

      {/* === LIGHTBOX === */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center transition-all duration-300 z-10"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-400/80 border border-gold-500/40 hover:bg-gold-500 text-gold-400 hover:text-black flex items-center justify-center transition-all duration-300 z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark-400/80 border border-gold-500/40 hover:bg-gold-500 text-gold-400 hover:text-black flex items-center justify-center transition-all duration-300 z-10"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].title}
              className="w-full h-full object-contain animate-[scaleIn_0.3s_ease-out]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-center">
              <h3 className="font-display text-2xl text-white font-bold">
                {filteredImages[lightboxIndex].title}
              </h3>
              <span className="text-gold-400 text-xs uppercase tracking-widest">
                {filteredImages[lightboxIndex].category} · {lightboxIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
