import { useEffect, useRef, useState } from "react";
import type { Room } from "../types";
import { useBooking } from "../context/BookingContext";

const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Room",
    description:
      "Elegantly appointed rooms featuring panoramic city views, marble bathrooms, and handcrafted furnishings for the discerning traveler.",
    price: "LKR 150,000",
    size: "45 m²",
    capacity: "2 Guests",
    image: "/images/deluxe-room.jpg",
    features: ["King-sized bed", "Marble bathroom", "City view", "Mini bar", "Wi-Fi", "Smart TV"],
  },
  {
    id: 2,
    name: "Executive Suite",
    description:
      "Spacious suites with separate living areas, breathtaking skyline views, and exclusive access to our Executive Lounge.",
    price: "LKR 280,000",
    size: "75 m²",
    capacity: "3 Guests",
    image: "/images/executive-suite.jpg",
    features: ["Separate living room", "Panoramic views", "Butler service", "Jacuzzi", "Nespresso", "VIP amenities"],
  },
  {
    id: 3,
    name: "Presidential Suite",
    description:
      "Our crown jewel — a sprawling penthouse with private terrace, personal butler, and unrivaled panoramic city views.",
    price: "LKR 850,000",
    size: "150 m²",
    capacity: "5 Guests",
    image: "/images/presidential-suite.jpg",
    features: ["Private terrace", "Personal butler", "Grand piano", "Private sauna", "Dining room", "Champagne bar"],
  },
];

interface RoomsProps {
  onRoomClick?: (room: Room) => void;
}

export default function Rooms({ onRoomClick }: RoomsProps = {}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { openBooking } = useBooking();

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

  // "View Details" still opens the modal, but the dedicated "Book Now" CTA
  // sends the user straight to the full reservation page.
  const handleViewDetails = (room: Room) => {
    if (onRoomClick) onRoomClick(room);
  };

  const handleBookNow = (room: Room) => {
    const numericPrice = parseInt(room.price.replace(/[^\d]/g, ""), 10) || 0;
    openBooking({
      roomName: room.name,
      roomPrice: numericPrice,
      roomType: room.name,
    });
  };

  return (
    <section id="rooms" ref={ref} className="relative py-20 md:py-32 bg-gradient-to-b from-dark-400 via-dark-300 to-dark-400 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-gold-400 text-sm uppercase tracking-[0.3em] font-medium">
            Accommodations
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-4 mb-4">
            Luxury Rooms & Suites
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Each room is a sanctuary of comfort, meticulously designed to provide an
            unforgettable stay
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-700 hover:border-gold-400/50 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-2 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-all duration-500 group-hover:from-black/60" />
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-gold-500 text-black font-bold px-4 py-2 text-sm">
                  {room.price}
                  <span className="font-normal text-xs"> /night</span>
                </div>

                {/* Room details overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-2xl text-white font-bold mb-1">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                      </svg>
                      {room.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      {room.capacity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {room.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTAs — view details + book now */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(room)}
                    className="flex-1 border border-white/15 text-gray-300 hover:bg-white/5 hover:text-white font-semibold py-3 text-xs uppercase tracking-widest transition-all duration-300"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleBookNow(room)}
                    className="group relative overflow-hidden flex-[2] bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3 text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Book Now
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
