import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookingBar from "./components/BookingBar";
import About from "./components/About";
import Rooms from "./components/Rooms";
import Dining from "./components/Dining";
import SpaWellness from "./components/SpaWellness";
import PoolFitness from "./components/PoolFitness";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Offers from "./components/Offers";
import Events from "./components/Events";
import Reviews from "./components/Reviews";
import CurrencyConverter from "./components/CurrencyConverter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import RoomDetailsModal from "./components/RoomDetailsModal";
import ConciergeChat from "./components/ConciergeChat";
import BackToTop from "./components/BackToTop";
import BookingPage from "./components/BookingPage";
import VirtualTour from "./components/VirtualTour";
import AdminDashboard from "./components/AdminDashboard";
import ManagerView from "./components/ManagerView";
import UserSessionBar from "./components/UserSessionBar";
import AuthModal from "./components/AuthModal";
import MySessionModal from "./components/MySessionModal";
import { ToastProvider } from "./components/Toast";
import { BookingProvider } from "./context/BookingContext";
import { VirtualTourProvider } from "./context/VirtualTourContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { SessionProvider } from "./context/SessionContext";
import type { Room } from "./types";

function PublicHotelSite() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <UserSessionBar />
      <Hero />
      <BookingBar />
      <About />
      <Rooms onRoomClick={handleRoomClick} />
      <Dining />
      <SpaWellness />
      <PoolFitness />
      <Gallery />
      <Events />
      <Reviews />
      <CurrencyConverter />
      <Testimonials />
      <Offers />
      <Contact />
      <Footer />
      <ConciergeChat />
      <BackToTop />

      <RoomDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
      />

      <BookingPage />
      <VirtualTour />
      <AuthModal />
      <MySessionModal />
    </div>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-500 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-gold-400">Loading Aurum</p>
        </div>
      </div>
    );
  }

  // Admin sees full dashboard; managers see only their assigned panel.
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  if (user?.role === "rooms-manager")        return <ManagerView panel="rooms"        title="Rooms Panel" />;
  if (user?.role === "reservations-manager") return <ManagerView panel="reservations" title="Reservations Panel" />;
  if (user?.role === "customers-manager")    return <ManagerView panel="customers"    title="Customers Panel" />;
  if (user?.role === "payments-manager")     return <ManagerView panel="payments"     title="Payments Panel" />;
  if (user?.role === "reviews-manager")      return <ManagerView panel="reviews"      title="Reviews Panel" />;
  if (user?.role === "services-manager")     return <ManagerView panel="services"     title="Facilities & Services Panel" />;

  return <PublicHotelSite />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SessionProvider>
          <AuthModalProvider>
            <BookingProvider>
              <VirtualTourProvider>
                <AppRouter />
              </VirtualTourProvider>
            </BookingProvider>
          </AuthModalProvider>
        </SessionProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
