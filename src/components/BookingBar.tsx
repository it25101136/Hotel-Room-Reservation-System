import { useState } from "react";
import { useBooking } from "../context/BookingContext";

export default function BookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");
  const { openBooking } = useBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openBooking({
      checkIn,
      checkOut,
      guests: parseInt(guests, 10) || 2,
      rooms: parseInt(rooms, 10) || 1,
    });
  };

  return (
    <section id="booking" className="relative z-20 -mt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/20 p-6 sm:p-8 flex flex-col lg:flex-row items-end gap-4 lg:gap-0 hover:shadow-gold-500/10 transition-shadow duration-500"
        >
          {/* Check-in */}
          <div className="flex-1 w-full lg:border-r border-gray-200 lg:pr-6 group">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium group-hover:text-gold-500 transition-colors duration-300">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 focus:border-gold-500 outline-none transition-all duration-300 text-sm group-hover:border-gold-300"
              required
            />
            <div className="h-[1px] bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>

          {/* Check-out */}
          <div className="flex-1 w-full lg:border-r border-gray-200 lg:px-6">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 focus:border-gold-500 outline-none transition-colors text-sm"
              required
            />
          </div>

          {/* Guests */}
          <div className="flex-1 w-full lg:border-r border-gray-200 lg:px-6">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 focus:border-gold-500 outline-none transition-colors text-sm cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} Guest{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Rooms */}
          <div className="flex-1 w-full lg:px-6">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">
              Rooms
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 focus:border-gold-500 outline-none transition-colors text-sm cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Room{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group relative overflow-hidden w-full lg:w-auto bg-gold-500 hover:bg-gold-400 text-black font-semibold px-10 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 whitespace-nowrap hover:-translate-y-0.5 btn-shine"
          >
            <span className="relative z-10 flex items-center gap-2">
              Check Availability
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
