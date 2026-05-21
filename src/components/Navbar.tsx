import { useState, useEffect } from "react";
import { cn } from "../utils/cn";
import type { NavLink } from "../types";
import { useToast } from "./Toast";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Rooms", href: "#rooms" },
  { label: "Dining", href: "#dining" },
  { label: "Spa", href: "#spa" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const phoneNumber = "+94 11 244 5555";

export default function Navbar() {
  const handleCall = () => {
    addToast(`Calling ${phoneNumber}...`, "info");
    window.open(`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`, "_blank");
  };

  const handleWhatsapp = () => {
    addToast("Opening WhatsApp chat...", "info");
    window.open("https://wa.me/94112445555", "_blank");
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { addToast } = useToast();
  const { openBooking } = useBooking();
  const { user, signOut } = useAuth();

  const handleBookNow = () => {
    addToast("Opening reservation page...", "info");
    openBooking();
    setMobileOpen(false);
  };

  const handleSignOut = () => {
    addToast("Signed out successfully.", "info");
    signOut();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center">
              <span className="text-gold-400 font-display text-xl font-bold">A</span>
            </div>
            <span
              className={cn(
                "font-display text-2xl font-bold tracking-wider transition-colors duration-300",
                scrolled ? "text-white" : "text-white"
              )}
            >
              AURUM
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-widest text-gray-300 hover:text-gold-400 transition-all duration-300 relative group py-2"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
                <span className="absolute inset-0 bg-gold-400/5 rounded-sm transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </a>
            ))}
            <button
              onClick={handleBookNow}
              className="group relative overflow-hidden bg-gold-500 hover:bg-gold-400 text-black font-semibold px-6 py-3 rounded-sm text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 btn-shine"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Now
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <button
              onClick={handleCall}
              className="group relative overflow-hidden border border-white/30 text-white hover:bg-white hover:text-dark-400 font-semibold px-4 py-3 rounded-sm text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              Call
            </button>
            <button
              onClick={handleWhatsapp}
              className="group relative overflow-hidden bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-3 rounded-sm text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            {user && (
              <>
                <div className="hidden xl:flex items-center gap-3 px-4 py-3 border border-white/10 bg-white/5 text-white">
                  <div className="w-8 h-8 rounded-full bg-gold-500 text-black flex items-center justify-center font-semibold text-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs uppercase tracking-widest text-gold-400">{user.role}</div>
                    <div className="text-sm font-medium max-w-[120px] truncate">{user.name}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group relative overflow-hidden border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black font-semibold px-4 py-3 rounded-sm text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 group"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "block w-6 h-[2px] transition-all duration-300",
                mobileOpen ? "rotate-45 translate-y-[3.5px] bg-gold-400" : "bg-white"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[2px] transition-all duration-300",
                mobileOpen ? "opacity-0" : "bg-white"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[2px] transition-all duration-300",
                mobileOpen ? "-rotate-45 -translate-y-[3.5px] bg-gold-400" : "bg-white"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/98 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl uppercase tracking-widest text-gray-300 hover:text-gold-400 transition-all duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleBookNow}
            className="mt-4 bg-gold-500 hover:bg-gold-400 text-black font-semibold px-10 py-4 rounded-sm text-sm uppercase tracking-widest transition-all duration-300"
          >
            Book Now
          </button>
          {user && (
            <>
              <div className="mt-2 text-center">
                <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-2">Signed in as</div>
                <div className="text-white font-display text-2xl">{user.name}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">{user.role}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-2 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black font-semibold px-10 py-4 rounded-sm text-sm uppercase tracking-widest transition-all duration-300"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
