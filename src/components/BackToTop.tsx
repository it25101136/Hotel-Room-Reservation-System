import { useEffect, useState } from "react";
import { useToast } from "./Toast";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    addToast("Scrolled to top", "info");
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-dark-400 hover:bg-gold-500 text-white hover:text-black flex items-center justify-center transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/40 hover:scale-110 group animate-[bounceSubtle_3s_ease-in-out_infinite]"
      aria-label="Back to top"
    >
      <svg className="w-5 h-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-ping" />
    </button>
  );
}
