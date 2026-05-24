import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";
import { useBooking } from "../context/BookingContext";

export default function SpaWellness() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { addToast } = useToast();
  const { openBooking } = useBooking();

  const handleBookTreatment = (treatmentName?: string) => {
    addToast(
      treatmentName ? `Opening booking for ${treatmentName}...` : "Opening spa booking page...",
      "info"
    );
    openBooking({
      purpose: "Spa Treatment Reservation",
      serviceName: treatmentName || "Spa & Wellness Experience",
      packageName: treatmentName || "Personalised Spa Consultation",
      guests: 1,
      rooms: 1,
    });
  };

  const handleViewAllTreatments = () => {
    addToast("Opening full spa consultation page...", "info");
    openBooking({
      purpose: "Spa Consultation Request",
      serviceName: "Full Spa & Wellness Menu",
      packageName: "All Treatments Consultation",
      guests: 1,
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

  const treatments = [
    { name: "Royal Gold Facial", duration: "90 min", price: "LKR 105,000" },
    { name: "Deep Tissue Massage", duration: "60 min", price: "LKR 72,000" },
    { name: "Aromatherapy Journey", duration: "75 min", price: "LKR 92,000" },
    { name: "Hot Stone Therapy", duration: "90 min", price: "LKR 115,000" },
  ];

  return (
    <section id="spa" ref={ref} className="relative py-20 md:py-32 bg-gradient-to-b from-dark-300 to-dark-400 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-1000 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(/images/spa.jpg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-6 right-6 bg-dark-400/90 backdrop-blur-md shadow-xl border border-gold-500/30 p-6 max-w-[200px]">
                <div className="text-gold-500 font-display text-2xl font-bold">Award-Winning</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">Spa & Wellness</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <span className="text-gold-500 text-sm uppercase tracking-[0.3em] font-medium">
              Spa & Wellness
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-dark-400 font-bold mt-4 mb-6 leading-tight">
              Restore Your
              <span className="block text-gold-500">Mind & Body</span>
            </h2>
            <div className="w-16 h-[2px] bg-gold-400 mb-8" />

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Our award-winning spa offers a sanctuary of tranquility, where ancient
              healing traditions meet modern wellness techniques. Let our expert
              therapists guide you on a journey of rejuvenation.
            </p>

            {/* Treatments */}
            <div className="space-y-4">
              {treatments.map((treatment, i) => (
              <button
                key={treatment.name}
                onClick={() => handleBookTreatment(treatment.name)}
                className={`w-full text-left flex items-center justify-between p-4 border border-gray-700 hover:border-gold-400 hover:bg-gold-500/5 transition-all duration-300 cursor-pointer group bg-dark-400 ${
                    visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div>
                    <h4 className="font-display text-lg text-white font-semibold group-hover:text-gold-500 transition-colors">
                      {treatment.name}
                    </h4>
                    <span className="text-gray-400 text-sm">{treatment.duration}</span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-display text-lg text-gold-500 font-bold">{treatment.price}</span>
                    <svg className="w-4 h-4 text-gold-400 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button
                onClick={() => handleBookTreatment()}
                className="group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold px-8 py-3.5 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
              >
                Book a Treatment
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleViewAllTreatments}
                className="group inline-flex items-center justify-center gap-2 border border-gold-500/40 text-gold-500 hover:bg-gold-500/10 font-semibold px-8 py-3.5 uppercase tracking-widest text-sm transition-all duration-300"
              >
                View All Treatments
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
