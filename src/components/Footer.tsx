import { useState } from "react";
import { useToast } from "./Toast";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2.02C18.88 4 12 4 12 4s-6.88 0-8.6.4a2.78 2.78 0 00-1.94 2.02A32.53 32.53 0 001 12a32.53 32.53 0 00.46 5.58 2.78 2.78 0 001.94 2.02c1.72.4 8.6.4 8.6.4s6.88 0 8.6-.4a2.78 2.78 0 001.94-2.02A32.53 32.53 0 0023 12a32.53 32.53 0 00-.46-5.58z" />
        <polygon points="9.75 8.75 16.5 12 9.75 15.25" />
      </svg>
    ),
  },
];

const quickLinks = [
  { label: "Rooms & Suites", href: "#rooms" },
  { label: "Dining", href: "#dining" },
  { label: "Spa & Wellness", href: "#spa" },
  { label: "Gallery", href: "#gallery" },
  { label: "Special Offers", href: "#offers" },
  { label: "Contact Us", href: "#contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Subscribed! Updates will be sent to ${email}`, "success");
    setEmail("");
  };

  const handleSocial = (name: string, url: string) => {
    addToast(`Opening ${name}...`, "info");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePolicy = (policy: string) => {
    addToast(`${policy} will open in a new window`, "info");
  };

  return (
    <footer className="relative bg-dark-500 text-white overflow-hidden">
      {/* Gold top border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Subtle gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-400/50 to-dark-500" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center">
                <span className="text-gold-400 font-display text-xl font-bold">A</span>
              </div>
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                AURUM
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Experience timeless luxury at our award-winning 5-star hotel. Where every
              moment becomes a treasured memory.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={() => handleSocial(social.name, social.href)}
                  className="group w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-black hover:border-gold-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gold-500/30"
                  aria-label={social.name}
                  title={social.name}
                >
                  <span className="group-hover:rotate-12 transition-transform duration-300">{social.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-gold-400">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-gold-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-400/50 rounded-full group-hover:bg-gold-400 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-gold-400">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Galle Face Hotel Road</li>
              <li>Colombo 003, Sri Lanka</li>
              <li className="pt-2">
                <a href="tel:+94112445555" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  +94 11 244 5555
                </a>
              </li>
              <li>
                <a href="mailto:concierge@aurumhotel.lk" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  concierge@aurumhotel.lk
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-gold-400">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-gold-400 outline-none transition-all duration-300 focus:shadow-lg focus:shadow-gold-500/20"
              />
              <button
                type="submit"
                className="group relative overflow-hidden bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 btn-shine"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Subscribe
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gold-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Aurum Hotel. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <button
              onClick={() => handlePolicy("Privacy Policy")}
              className="hover:text-gold-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handlePolicy("Terms of Service")}
              className="hover:text-gold-400 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => handlePolicy("Cookie Policy")}
              className="hover:text-gold-400 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
