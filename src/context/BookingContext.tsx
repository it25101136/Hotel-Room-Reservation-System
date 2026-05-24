import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";
import { useSession } from "./SessionContext";

// Type definition for the data passed when opening the booking page
export interface BookingPrefill {
  roomName?: string;
  roomPrice?: number;     // LKR per night
  roomType?: string;
  packageName?: string;
  serviceName?: string;
  eventName?: string;
  purpose?: string;       // General booking context label
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

interface BookingContextValue {
  isOpen: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { trackActivity } = useSession();

  const showBooking = (data: BookingPrefill = {}) => {
    setPrefill(data);
    setIsOpen(true);
    document.body.style.overflow = "hidden";

    // Track booking activity in session history
    const title = data.roomName
      ? `Booking: ${data.roomName}`
      : data.packageName
        ? `Booking: ${data.packageName}`
        : data.serviceName
          ? `Service request: ${data.serviceName}`
          : data.eventName
            ? `Event inquiry: ${data.eventName}`
            : "Started booking";

    const description = data.purpose
      ? `Opened booking page for ${data.purpose}.`
      : "Opened booking page from the website.";

    const type: "booking" | "spa-request" | "event-inquiry" | "view-menu" =
      data.purpose?.toLowerCase().includes("spa") ? "spa-request"
      : data.purpose?.toLowerCase().includes("event") || data.purpose?.toLowerCase().includes("wedding") ? "event-inquiry"
      : data.purpose?.toLowerCase().includes("menu") ? "view-menu"
      : "booking";

    trackActivity(type, title, description, {
      ...(data.roomName ? { room: data.roomName } : {}),
      ...(data.guests ? { guests: data.guests } : {}),
      ...(data.checkIn ? { checkIn: data.checkIn } : {}),
    });
  };

  const openBooking = (data: BookingPrefill = {}) => {
    if (!user) {
      openAuth("Sign in to continue with your reservation and save your preferences.", () => {
        showBooking(data);
      });
      return;
    }
    showBooking(data);
  };

  const closeBooking = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <BookingContext.Provider value={{ isOpen, prefill, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
