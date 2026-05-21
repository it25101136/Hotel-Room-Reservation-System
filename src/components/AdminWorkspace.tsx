import { useEffect, useMemo, useState } from "react";
import { useToast } from "./Toast";

export type AdminPanelKey =
  | "rooms"
  | "reservations"
  | "customers"
  | "payments"
  | "reviews"
  | "services";

interface AdminWorkspaceProps {
  panel: AdminPanelKey;
  onClose: () => void;
  onChangePanel: (panel: AdminPanelKey) => void;
}

type RoomItem = {
  id: number;
  type: string;
  price: string;
  status: "Available" | "Occupied" | "Maintenance";
  view: string;
};

type ReservationItem = {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: "Confirmed" | "Pending" | "Checked In" | "Cancelled";
};

type CustomerItem = {
  id: string;
  name: string;
  tier: "Guest" | "VIP";
  email: string;
  stays: number;
};

type PaymentItem = {
  id: string;
  guest: string;
  amount: string;
  method: string;
  status: "Paid" | "Pending" | "Refunded";
};

type ReviewItem = {
  id: string;
  guest: string;
  rating: number;
  room: string;
  status: "Pending" | "Approved" | "Rejected";
  comment: string;
};

type ServiceItem = {
  id: string;
  name: string;
  category: string;
  status: "Available" | "Busy" | "Paused";
  requests: number;
};

const panelMeta: Record<
  AdminPanelKey,
  { title: string; subtitle: string; icon: string; tone: string }
> = {
  rooms: {
    title: "Rooms Panel",
    subtitle: "Manage inventory, pricing, views and room readiness.",
    icon: "🛏️",
    tone: "from-gold-500/10 to-gold-400/5",
  },
  reservations: {
    title: "Reservations Panel",
    subtitle: "Track check-ins, departures and booking confirmations.",
    icon: "📅",
    tone: "from-sky-500/10 to-sky-400/5",
  },
  customers: {
    title: "Customers Panel",
    subtitle: "Search guests, manage VIP status and activity history.",
    icon: "👤",
    tone: "from-emerald-500/10 to-emerald-400/5",
  },
  payments: {
    title: "Payments Panel",
    subtitle: "Review payment status, invoices and revenue operations.",
    icon: "💳",
    tone: "from-violet-500/10 to-violet-400/5",
  },
  reviews: {
    title: "Reviews Panel",
    subtitle: "Moderate feedback, highlight praise and resolve issues.",
    icon: "⭐",
    tone: "from-amber-500/10 to-amber-400/5",
  },
  services: {
    title: "Services Panel",
    subtitle: "Operate spa, dining, transport and guest request workflows.",
    icon: "🧖",
    tone: "from-rose-500/10 to-rose-400/5",
  },
};

const navItems: { key: AdminPanelKey; label: string; icon: string }[] = [
  { key: "rooms", label: "Rooms", icon: "🛏️" },
  { key: "reservations", label: "Reservations", icon: "📅" },
  { key: "customers", label: "Customers", icon: "👤" },
  { key: "payments", label: "Payments", icon: "💳" },
  { key: "reviews", label: "Reviews", icon: "⭐" },
  { key: "services", label: "Services", icon: "🧖" },
];

export default function AdminWorkspace({ panel, onClose, onChangePanel }: AdminWorkspaceProps) {
  const { addToast } = useToast();
  const [query, setQuery] = useState("");

  const [rooms, setRooms] = useState<RoomItem[]>([
    { id: 101, type: "Deluxe Room", price: "LKR 150,000", status: "Occupied", view: "City View" },
    { id: 102, type: "Deluxe Room", price: "LKR 150,000", status: "Available", view: "Garden View" },
    { id: 201, type: "Executive Suite", price: "LKR 280,000", status: "Occupied", view: "Ocean View" },
    { id: 301, type: "Presidential Suite", price: "LKR 850,000", status: "Maintenance", view: "Panoramic View" },
  ]);

  const [reservations, setReservations] = useState<ReservationItem[]>([
    { id: "R-2048", guest: "Nimali Silva", room: "301", checkIn: "2026-05-16", checkOut: "2026-05-18", status: "Confirmed" },
    { id: "R-2051", guest: "Amal Perera", room: "102", checkIn: "2026-05-15", checkOut: "2026-05-17", status: "Checked In" },
    { id: "R-2054", guest: "Kasun Fernando", room: "201", checkIn: "2026-05-19", checkOut: "2026-05-21", status: "Pending" },
    { id: "R-2057", guest: "Priya Nair", room: "101", checkIn: "2026-05-22", checkOut: "2026-05-24", status: "Cancelled" },
  ]);

  const [customers, setCustomers] = useState<CustomerItem[]>([
    { id: "C-001", name: "Aurum Guest", tier: "Guest", email: "guest@aurumhotel.lk", stays: 2 },
    { id: "C-002", name: "Aurum VIP", tier: "VIP", email: "vip@aurumhotel.lk", stays: 9 },
    { id: "C-114", name: "Nimali Silva", tier: "VIP", email: "nimali@aurum.lk", stays: 5 },
    { id: "C-233", name: "Amal Perera", tier: "Guest", email: "amal@aurum.lk", stays: 1 },
  ]);

  const [payments, setPayments] = useState<PaymentItem[]>([
    { id: "P-9001", guest: "Nimali Silva", amount: "LKR 850,000", method: "Card", status: "Paid" },
    { id: "P-9002", guest: "Amal Perera", amount: "LKR 150,000", method: "Pay at Hotel", status: "Pending" },
    { id: "P-9003", guest: "Kasun Fernando", amount: "LKR 280,000", method: "Bank Transfer", status: "Paid" },
    { id: "P-9004", guest: "Priya Nair", amount: "LKR 150,000", method: "Card", status: "Refunded" },
  ]);

  const [reviews, setReviews] = useState<ReviewItem[]>([
    { id: "RV-01", guest: "Nimali Silva", rating: 5, room: "301", status: "Approved", comment: "Exceptional suite, impeccable service." },
    { id: "RV-02", guest: "Amal Perera", rating: 4, room: "102", status: "Pending", comment: "Very elegant stay, breakfast was excellent." },
    { id: "RV-03", guest: "Kasun Fernando", rating: 3, room: "201", status: "Rejected", comment: "Service was good, but room prep was delayed." },
  ]);

  const [services, setServices] = useState<ServiceItem[]>([
    { id: "S-01", name: "Royal Gold Facial", category: "Spa", status: "Busy", requests: 8 },
    { id: "S-02", name: "Airport Pickup", category: "Transport", status: "Available", requests: 5 },
    { id: "S-03", name: "Breakfast Buffet", category: "Dining", status: "Available", requests: 14 },
    { id: "S-04", name: "Infinity Pool Access", category: "Leisure", status: "Paused", requests: 0 },
  ]);

  const filteredRooms = useMemo(
    () => rooms.filter((r) => `${r.id} ${r.type} ${r.view} ${r.status}`.toLowerCase().includes(query.toLowerCase())),
    [rooms, query]
  );
  const filteredReservations = useMemo(
    () => reservations.filter((r) => `${r.id} ${r.guest} ${r.room} ${r.status}`.toLowerCase().includes(query.toLowerCase())),
    [reservations, query]
  );
  const filteredCustomers = useMemo(
    () => customers.filter((c) => `${c.id} ${c.name} ${c.email} ${c.tier}`.toLowerCase().includes(query.toLowerCase())),
    [customers, query]
  );
  const filteredPayments = useMemo(
    () => payments.filter((p) => `${p.id} ${p.guest} ${p.method} ${p.status}`.toLowerCase().includes(query.toLowerCase())),
    [payments, query]
  );
  const filteredReviews = useMemo(
    () => reviews.filter((r) => `${r.id} ${r.guest} ${r.comment} ${r.status}`.toLowerCase().includes(query.toLowerCase())),
    [reviews, query]
  );
  const filteredServices = useMemo(
    () => services.filter((s) => `${s.id} ${s.name} ${s.category} ${s.status}`.toLowerCase().includes(query.toLowerCase())),
    [services, query]
  );

  const handleGeneric = (label: string) => addToast(label, "info");

  const markRoom = (id: number, status: RoomItem["status"]) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, status } : room)));
    addToast(`Room ${id} marked as ${status}`, "success");
  };

  const updateReservationStatus = (id: string, status: ReservationItem["status"]) => {
    setReservations((prev) => prev.map((reservation) => (reservation.id === id ? { ...reservation, status } : reservation)));
    addToast(`Reservation ${id} updated to ${status}`, "success");
  };

  const upgradeCustomer = (id: string) => {
    setCustomers((prev) => prev.map((customer) => (customer.id === id ? { ...customer, tier: "VIP" } : customer)));
    addToast(`Customer ${id} upgraded to VIP`, "success");
  };

  const updatePaymentStatus = (id: string, status: PaymentItem["status"]) => {
    setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, status } : payment)));
    addToast(`Payment ${id} marked as ${status}`, "success");
  };

  const moderateReview = (id: string, status: ReviewItem["status"]) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
    addToast(`Review ${id} changed to ${status}`, "success");
  };

  const updateServiceStatus = (id: string, status: ServiceItem["status"]) => {
    setServices((prev) => prev.map((service) => (service.id === id ? { ...service, status } : service)));
    addToast(`Service ${id} updated to ${status}`, "success");
  };

  const meta = panelMeta[panel];

  // Close on Escape key + lock body scroll while panel is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[260] bg-black/85 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6 animate-[fadeIn_0.25s_ease-out]"
      onClick={onClose}
    >
      <div
        className={`relative my-4 w-full max-w-7xl border border-gold-500/20 bg-gradient-to-br ${meta.tone} backdrop-blur-xl shadow-2xl shadow-black/60`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-11 h-11 border border-white/10 bg-black/40 text-white hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 flex items-center justify-center"
          aria-label="Close panel"
          title="Close (Esc)"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-6 pr-20 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-2">Management Workspace</div>
            <h2 className="font-display text-3xl text-white font-bold flex items-center gap-3">
              <span>{meta.icon}</span>
              {meta.title}
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl text-sm">{meta.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleGeneric(`Exported ${meta.title} snapshot`)}
              className="px-4 py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black uppercase tracking-widest text-xs transition-all duration-300"
            >
              Export
            </button>
            <button
              onClick={() => handleGeneric(`Refreshed ${meta.title}`)}
              className="px-4 py-3 border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white uppercase tracking-widest text-xs transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation pills */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-white/10 bg-black/20">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onChangePanel(item.key)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 border ${
                panel === item.key
                  ? "bg-gold-500 text-black border-gold-500"
                  : "bg-white/5 text-gray-300 border-white/10 hover:border-gold-500/30 hover:text-gold-400"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Search + helper actions */}
        <div className="p-4 sm:p-6 border-b border-white/10 grid lg:grid-cols-[1fr_auto] gap-4 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search within ${meta.title.toLowerCase()}...`}
            className="w-full bg-dark-500/80 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 outline-none transition-all"
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleGeneric(`Added new item in ${meta.title}`)}
              className="px-5 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300"
            >
              Add New
            </button>
            <button
              onClick={() => handleGeneric(`Opened analytics for ${meta.title}`)}
              className="px-5 py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 font-semibold uppercase tracking-widest text-xs transition-all duration-300"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Dynamic panel content */}
        <div className="p-4 sm:p-6">
          {panel === "rooms" && (
            <PanelLayout
              summary={[
                ["Total Rooms", `${rooms.length}`],
                ["Available", `${rooms.filter((r) => r.status === "Available").length}`],
                ["Occupied", `${rooms.filter((r) => r.status === "Occupied").length}`],
                ["Maintenance", `${rooms.filter((r) => r.status === "Maintenance").length}`],
              ]}
            >
              <AdminTable
                headers={["Room", "Type", "Rate", "View", "Status", "Actions"]}
                rows={filteredRooms.map((room) => [
                  `#${room.id}`,
                  room.type,
                  room.price,
                  room.view,
                  <StatusBadge key={`${room.id}-status`} status={room.status} />, 
                  <div key={`${room.id}-actions`} className="flex flex-wrap gap-2">
                    <MiniAction onClick={() => markRoom(room.id, "Available")}>Set Available</MiniAction>
                    <MiniAction onClick={() => markRoom(room.id, "Occupied")}>Set Occupied</MiniAction>
                    <MiniAction onClick={() => markRoom(room.id, "Maintenance")}>Maintenance</MiniAction>
                  </div>,
                ])}
              />
            </PanelLayout>
          )}

          {panel === "reservations" && (
            <PanelLayout
              summary={[
                ["Today Check-ins", `${reservations.filter((r) => r.status === "Checked In").length}`],
                ["Pending", `${reservations.filter((r) => r.status === "Pending").length}`],
                ["Confirmed", `${reservations.filter((r) => r.status === "Confirmed").length}`],
                ["Cancelled", `${reservations.filter((r) => r.status === "Cancelled").length}`],
              ]}
            >
              <AdminTable
                headers={["Reservation", "Guest", "Room", "Check-in", "Check-out", "Status", "Actions"]}
                rows={filteredReservations.map((reservation) => [
                  reservation.id,
                  reservation.guest,
                  reservation.room,
                  reservation.checkIn,
                  reservation.checkOut,
                  <StatusBadge key={`${reservation.id}-status`} status={reservation.status} />, 
                  <div key={`${reservation.id}-actions`} className="flex flex-wrap gap-2">
                    <MiniAction onClick={() => updateReservationStatus(reservation.id, "Confirmed")}>Confirm</MiniAction>
                    <MiniAction onClick={() => updateReservationStatus(reservation.id, "Checked In")}>Check In</MiniAction>
                    <MiniAction onClick={() => updateReservationStatus(reservation.id, "Cancelled")}>Cancel</MiniAction>
                  </div>,
                ])}
              />
            </PanelLayout>
          )}

          {panel === "customers" && (
            <PanelLayout
              summary={[
                ["Total Guests", `${customers.length}`],
                ["VIP Guests", `${customers.filter((c) => c.tier === "VIP").length}`],
                ["Repeat Guests", `${customers.filter((c) => c.stays > 1).length}`],
                ["Average Stays", `${Math.round(customers.reduce((sum, c) => sum + c.stays, 0) / customers.length)}`],
              ]}
            >
              <AdminTable
                headers={["Customer", "Tier", "Email", "Total Stays", "Actions"]}
                rows={filteredCustomers.map((customer) => [
                  `${customer.id} · ${customer.name}`,
                  <StatusBadge key={`${customer.id}-tier`} status={customer.tier} />,
                  customer.email,
                  `${customer.stays}`,
                  <div key={`${customer.id}-actions`} className="flex flex-wrap gap-2">
                    <MiniAction onClick={() => handleGeneric(`Opened profile for ${customer.name}`)}>Profile</MiniAction>
                    {customer.tier === "Guest" ? (
                      <MiniAction onClick={() => upgradeCustomer(customer.id)}>Upgrade VIP</MiniAction>
                    ) : (
                      <MiniAction onClick={() => handleGeneric(`VIP care team notified for ${customer.name}`)}>VIP Care</MiniAction>
                    )}
                    <MiniAction onClick={() => handleGeneric(`Message sent to ${customer.email}`)}>Message</MiniAction>
                  </div>,
                ])}
              />
            </PanelLayout>
          )}

          {panel === "payments" && (
            <PanelLayout
              summary={[
                ["Paid", `${payments.filter((p) => p.status === "Paid").length}`],
                ["Pending", `${payments.filter((p) => p.status === "Pending").length}`],
                ["Refunded", `${payments.filter((p) => p.status === "Refunded").length}`],
                ["Outstanding", "LKR 150,000"],
              ]}
            >
              <AdminTable
                headers={["Payment", "Guest", "Amount", "Method", "Status", "Actions"]}
                rows={filteredPayments.map((payment) => [
                  payment.id,
                  payment.guest,
                  payment.amount,
                  payment.method,
                  <StatusBadge key={`${payment.id}-status`} status={payment.status} />,
                  <div key={`${payment.id}-actions`} className="flex flex-wrap gap-2">
                    <MiniAction onClick={() => updatePaymentStatus(payment.id, "Paid")}>Mark Paid</MiniAction>
                    <MiniAction onClick={() => updatePaymentStatus(payment.id, "Refunded")}>Refund</MiniAction>
                    <MiniAction onClick={() => handleGeneric(`Invoice exported for ${payment.id}`)}>Invoice</MiniAction>
                  </div>,
                ])}
              />
            </PanelLayout>
          )}

          {panel === "reviews" && (
            <PanelLayout
              summary={[
                ["Pending", `${reviews.filter((r) => r.status === "Pending").length}`],
                ["Approved", `${reviews.filter((r) => r.status === "Approved").length}`],
                ["Rejected", `${reviews.filter((r) => r.status === "Rejected").length}`],
                ["Average Rating", "4.8 / 5"],
              ]}
            >
              <div className="grid lg:grid-cols-2 gap-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border border-white/10 bg-dark-500/40 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="text-white font-semibold">{review.guest}</div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">{review.id} · Room {review.room}</div>
                      </div>
                      <StatusBadge status={review.status} />
                    </div>
                    <div className="text-gold-400 text-sm mb-3">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <MiniAction onClick={() => moderateReview(review.id, "Approved")}>Approve</MiniAction>
                      <MiniAction onClick={() => moderateReview(review.id, "Rejected")}>Reject</MiniAction>
                      <MiniAction onClick={() => handleGeneric(`Pinned review ${review.id} to highlights`)}>Pin</MiniAction>
                    </div>
                  </div>
                ))}
              </div>
            </PanelLayout>
          )}

          {panel === "services" && (
            <PanelLayout
              summary={[
                ["Active Services", `${services.filter((s) => s.status !== "Paused").length}`],
                ["Busy", `${services.filter((s) => s.status === "Busy").length}`],
                ["Paused", `${services.filter((s) => s.status === "Paused").length}`],
                ["Guest Requests", `${services.reduce((sum, s) => sum + s.requests, 0)}`],
              ]}
            >
              <AdminTable
                headers={["Service", "Category", "Requests", "Status", "Actions"]}
                rows={filteredServices.map((service) => [
                  `${service.id} · ${service.name}`,
                  service.category,
                  `${service.requests}`,
                  <StatusBadge key={`${service.id}-status`} status={service.status} />,
                  <div key={`${service.id}-actions`} className="flex flex-wrap gap-2">
                    <MiniAction onClick={() => updateServiceStatus(service.id, "Available")}>Available</MiniAction>
                    <MiniAction onClick={() => updateServiceStatus(service.id, "Busy")}>Busy</MiniAction>
                    <MiniAction onClick={() => updateServiceStatus(service.id, "Paused")}>Pause</MiniAction>
                  </div>,
                ])}
              />
            </PanelLayout>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelLayout({
  summary,
  children,
}: {
  summary: [string, string][];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map(([label, value]) => (
          <div key={label} className="bg-black/25 border border-white/10 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-gray-500">{label}</div>
            <div className="font-display text-2xl text-gold-400 font-bold mt-2">{value}</div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto border border-white/10 bg-black/20">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs uppercase tracking-[0.22em] text-gold-400 font-medium whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-4 text-gray-300 align-top whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 border border-gold-500/25 text-gold-400 hover:bg-gold-500 hover:text-black text-[11px] uppercase tracking-[0.18em] transition-all duration-300"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style = (() => {
    const s = status.toLowerCase();
    if (s.includes("available") || s.includes("approved") || s.includes("paid") || s.includes("vip") || s.includes("confirmed")) {
      return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    }
    if (s.includes("pending") || s.includes("maintenance") || s.includes("busy") || s.includes("paused")) {
      return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    }
    if (s.includes("cancel") || s.includes("reject") || s.includes("refund")) {
      return "text-rose-400 border-rose-500/20 bg-rose-500/10";
    }
    if (s.includes("checked in")) {
      return "text-sky-400 border-sky-500/20 bg-sky-500/10";
    }
    return "text-gray-300 border-white/10 bg-white/5";
  })();

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-[0.18em] border ${style}`}>
      {status}
    </span>
  );
}
