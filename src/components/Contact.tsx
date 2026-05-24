import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";

export default function Contact() {
  const [visible, setVisible] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    addToast(
      `Thank you, ${formData.get("name")}! Our concierge will contact you within 24 hours.`,
      "success"
    );
    form.reset();
  };

  // Quick action handlers
  const handleCall = () => {
    addToast("Opening phone dialer...", "info");
    window.location.href = "tel:+94112445555";
  };

  const handleEmail = () => {
    addToast("Opening email client...", "info");
    window.location.href = "mailto:concierge@aurumhotel.lk?subject=Aurum%20Hotel%20Inquiry";
  };

  const handleDirections = () => {
    addToast("Opening Google Maps directions...", "info");
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=Galle+Face+Hotel+Road,+Colombo+003,+Sri+Lanka",
      "_blank"
    );
  };

  const handleWhatsapp = () => {
    addToast("Opening WhatsApp...", "info");
    window.open(
      "https://wa.me/94112445555?text=Hello%20Aurum%20Hotel%2C%20I%20would%20like%20to%20inquire%20about...",
      "_blank"
    );
  };

  const handleViewLargerMap = () => {
    addToast("Opening Google Maps...", "info");
    window.open(
      "https://www.google.com/maps/place/Galle+Face+Green/@6.9173249,79.8451884,17z",
      "_blank"
    );
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-20 md:py-32 bg-dark-300 overflow-hidden"
    >
      {/* Decorative gold glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-500/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm uppercase tracking-[0.3em] font-medium">
            Contact
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-4 mb-4">
            Get In Touch
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Our concierge team is available 24/7 to assist you with any inquiry.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* === LEFT: Map + Contact Info === */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Google Maps Embed */}
            <div className="relative h-72 md:h-80 rounded-sm overflow-hidden shadow-2xl border border-gold-500/20 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.797205985284!2d79.85675637499999!3d6.914702793170711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2592300b9b6c5%3A0x8e8c6a8e8c6a8e8c!2sGalle%20Face%20Green%2C%20Colombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Aurum Hotel Location"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Floating "View larger" button */}
              <button
                onClick={handleViewLargerMap}
                className="absolute top-3 right-3 bg-dark-400/90 backdrop-blur-sm border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black px-3 py-2 text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg"
                aria-label="Open in Google Maps"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <path d="M15 3h6v6M10 14L21 3" />
                </svg>
                Larger Map
              </button>
            </div>

            {/* === Contact Info Cards UNDER the map === */}
            <div className="bg-dark-400/60 backdrop-blur-sm border border-gold-500/20 rounded-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gold-500/20 bg-gradient-to-r from-gold-500/5 to-transparent">
                <h3 className="font-display text-xl text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Aurum Hotel — Colombo
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                  Concierge available 24/7
                </p>
              </div>

              {/* Address */}
              <button
                onClick={handleDirections}
                className="w-full flex items-start gap-4 p-5 border-b border-white/5 hover:bg-gold-500/5 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-300 shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-gold-400 mb-1 font-semibold">
                    Address
                  </div>
                  <div className="text-white text-sm font-medium leading-relaxed">
                    Galle Face Hotel Road,<br />
                    Colombo 003, Sri Lanka
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-2 group-hover:text-gold-400 transition-colors">
                    Get directions
                    <svg
                      className="w-3 h-3 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* Phone */}
              <button
                onClick={handleCall}
                className="w-full flex items-start gap-4 p-5 border-b border-white/5 hover:bg-gold-500/5 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-300 shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-gold-400 mb-1 font-semibold">
                    Phone
                  </div>
                  <div className="text-white text-sm font-medium">
                    +94 11 244 5555
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Reservations · Mon-Sun · 24 hours
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-2 group-hover:text-gold-400 transition-colors">
                    Tap to call
                    <svg
                      className="w-3 h-3 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                className="w-full flex items-start gap-4 p-5 border-b border-white/5 hover:bg-gold-500/5 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-300 shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-gold-400 mb-1 font-semibold">
                    Email
                  </div>
                  <div className="text-white text-sm font-medium break-all">
                    concierge@aurumhotel.lk
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Reply within 2 hours
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-2 group-hover:text-gold-400 transition-colors">
                    Send email
                    <svg
                      className="w-3 h-3 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsapp}
                className="w-full flex items-start gap-4 p-5 hover:bg-green-500/5 transition-all duration-300 text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-green-600/15 border border-green-600/40 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-green-500 mb-1 font-semibold">
                    WhatsApp
                  </div>
                  <div className="text-white text-sm font-medium">
                    +94 11 244 5555
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Instant chat with our concierge
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-2 group-hover:text-green-500 transition-colors">
                    Chat now
                    <svg
                      className="w-3 h-3 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            </div>

            {/* Hours of Operation */}
            <div className="bg-dark-400/60 backdrop-blur-sm border border-gold-500/20 rounded-sm p-5">
              <h4 className="font-display text-lg text-gold-400 font-bold mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Hours of Operation
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Reception", value: "24 / 7" },
                  { label: "Restaurant", value: "06:00 — 23:00" },
                  { label: "Spa & Wellness", value: "08:00 — 22:00" },
                  { label: "Fitness Center", value: "05:00 — 23:00" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-1 border-b border-white/5 last:border-0"
                  >
                    <span className="text-gray-400">{row.label}</span>
                    <span className="text-white font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === RIGHT: Contact Form === */}
          <div
            className={`transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-dark-400/60 backdrop-blur-sm border border-gold-500/20 rounded-sm p-6 md:p-8">
              <div className="mb-6">
                <h3 className="font-display text-2xl text-white font-bold">
                  Send us a message
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Our team will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all duration-300 text-sm rounded-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all duration-300 text-sm rounded-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all duration-300 text-sm rounded-sm"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all duration-300 text-sm rounded-sm cursor-pointer"
                    >
                      <option>Room Booking</option>
                      <option>Dining Reservation</option>
                      <option>Spa Appointment</option>
                      <option>Event Inquiry</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all duration-300 text-sm resize-none rounded-sm"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="flex items-start gap-3 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    id="contact-consent"
                    required
                    className="mt-1 accent-gold-500"
                  />
                  <label htmlFor="contact-consent" className="leading-relaxed">
                    I agree that Aurum Hotel may use my information to respond to my inquiry.
                    Read our{" "}
                    <a href="#" className="text-gold-400 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  className="group relative overflow-hidden w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Message
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
