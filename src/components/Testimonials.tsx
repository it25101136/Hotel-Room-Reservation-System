import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "../types";

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Victoria Harrington",
    title: "CEO, Harrington Group",
    avatar: "",
    text: "Aurum redefines what a luxury hotel should be. From the moment we arrived, every detail was perfection. The Presidential Suite was absolutely breathtaking, and the staff anticipated our every need.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Mitchell",
    title: "Travel Correspondent",
    avatar: "",
    text: "I've stayed at countless 5-star hotels worldwide, but Aurum stands apart. The attention to detail, the warmth of the service, and the sheer elegance of the property make it truly exceptional.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sophie Chen",
    title: "Lifestyle Blogger",
    avatar: "",
    text: "The spa experience at Aurum was transformative. Combined with the exquisite dining at their signature restaurant, this is the ultimate destination for those who appreciate the finer things in life.",
    rating: 5,
  },
  {
    id: 4,
    name: "Alexander Dubois",
    title: "International Businessman",
    avatar: "",
    text: "As someone who frequently travels for business, Aurum provides the perfect blend of professionalism and luxury. The executive lounge and concierge service are unmatched.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-gold-400" : "text-gray-300"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLElement>(null);

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

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [visible]);

  const t = testimonials[current];

  // Generate initials for avatar
  const initials = t.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-dark-400 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold-500/10 to-transparent opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-sm uppercase tracking-[0.3em] font-medium">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark-400 font-bold mt-4 mb-4">
            Guest Experiences
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
        </div>

        <div
          className={`text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Quote */}
          <div className="relative mb-8">
            <svg className="w-12 h-12 mx-auto text-gold-200 mb-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
            </svg>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light italic max-w-3xl mx-auto">
              &ldquo;{t.text}&rdquo;
            </p>
          </div>

          {/* Avatar & Info */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gold-100 border-2 border-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/20 hover:scale-110 transition-transform duration-300">
              <span className="font-display text-lg font-bold text-gold-600">{initials}</span>
            </div>
            <div className="text-left">
              <div className="font-display text-lg font-bold text-dark-400 hover:text-gold-500 transition-colors duration-300">{t.name}</div>
              <div className="text-gray-500 text-sm">{t.title}</div>
            </div>
          </div>

          <StarRating rating={t.rating} />

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 rounded-full ${
                  current === index
                    ? "w-3 h-3 bg-gold-500"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
