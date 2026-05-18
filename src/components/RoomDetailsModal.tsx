import { useToast } from "./Toast";
import { useBooking } from "../context/BookingContext";
import type { Room } from "../types";

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export default function RoomDetailsModal({ onClose, room }: RoomDetailsModalProps) {
  const { addToast } = useToast();
  const { openBooking } = useBooking();

  if (!room) return null;

  const handleBookNow = () => {
    const numericPrice = parseInt(room.price.replace(/[^\d]/g, ""), 10) || 0;
    onClose();
    openBooking({
      roomName: room.name,
      roomPrice: numericPrice,
      roomType: room.name,
    });
  };

  const handleContactConcierge = () => {
    addToast("Concierge will contact you within 30 minutes", "info");
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Room Image */}
      <div className="relative h-64 md:h-80 rounded-sm overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h3 className="font-display text-3xl text-white font-bold">{room.name}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-gold-400 text-lg">{room.price} <span className="text-white/70 text-sm">/ night</span></p>
            {room.originalPrice && (
              <p className="text-white/50 text-sm line-through">{room.originalPrice}</p>
            )}
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-marble-50 rounded-sm">
        <div className="text-center">
          <div className="text-gold-500 font-display text-xl font-bold">{room.size}</div>
          <div className="text-gray-500 text-xs uppercase tracking-wider">Size</div>
        </div>
        <div className="text-center">
          <div className="text-gold-500 font-display text-xl font-bold">{room.capacity}</div>
          <div className="text-gray-500 text-xs uppercase tracking-wider">Capacity</div>
        </div>
        <div className="text-center">
          <div className="text-gold-500 font-display text-xl font-bold">5★</div>
          <div className="text-gray-500 text-xs uppercase tracking-wider">Rating</div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-display text-lg font-bold text-dark-400 mb-3">Description</h4>
        <p className="text-gray-600 leading-relaxed">{room.description}</p>
      </div>

      {/* Features */}
      <div>
        <h4 className="font-display text-lg font-bold text-dark-400 mb-3">Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {room.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-gold-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleBookNow}
          className="flex-1 bg-gold-500 hover:bg-gold-400 text-black font-semibold py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
        >
          Book This Room
        </button>
        <button
          onClick={handleContactConcierge}
          className="flex-1 border border-dark-400 text-dark-400 hover:bg-dark-400 hover:text-white font-semibold py-4 uppercase tracking-widest text-sm transition-all duration-300"
        >
          Contact Concierge
        </button>
        <button
          onClick={onClose}
          className="sm:w-auto px-8 py-4 text-gray-500 hover:text-dark-400 font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
