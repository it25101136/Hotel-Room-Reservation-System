import { useEffect, useMemo, useState } from "react";
import { useToast } from "./Toast";
import { apiClient } from "../utils/apiClient";
import AddItemModal, { type FormField } from "./AddItemModal";
import AnalyticsModal, {
  type AnalyticsStat,
  type AnalyticsBreakdown,
  type AnalyticsInsight,
} from "./AnalyticsModal";
import { InvoiceModal, CustomerProfileModal, CustomerMessageModal } from "./ManagementModals";

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
  /** If provided, only these panel tabs will be shown. */
  allowedPanels?: AdminPanelKey[];
  /** Hides the close (X) button when true (e.g. manager-only view). */
  hideClose?: boolean;
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

export default function AdminWorkspace({
  panel,
  onClose,
  onChangePanel,
  allowedPanels,
  hideClose,
}: AdminWorkspaceProps) {
  const visibleNavItems = allowedPanels
    ? navItems.filter((item) => allowedPanels.includes(item.key))
    : navItems;
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string | number; data: Record<string, string> } | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Modular Modals State
  const [activeProfileCustomer, setActiveProfileCustomer] = useState<CustomerItem | null>(null);
  const [activeMessageCustomer, setActiveMessageCustomer] = useState<CustomerItem | null>(null);
  const [activeInvoicePayment, setActiveInvoicePayment] = useState<PaymentItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [rooms, setRooms] = useState<RoomItem[]>(() => {
    const raw = localStorage.getItem("aurum-rooms");
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaults: RoomItem[] = [
      { id: 101, type: "Deluxe Room", price: "LKR 150,000", status: "Occupied", view: "City View" },
      { id: 102, type: "Deluxe Room", price: "LKR 150,000", status: "Available", view: "Garden View" },
      { id: 201, type: "Executive Suite", price: "LKR 280,000", status: "Occupied", view: "Ocean View" },
      { id: 301, type: "Presidential Suite", price: "LKR 850,000", status: "Maintenance", view: "Panoramic View" },
    ];
    localStorage.setItem("aurum-rooms", JSON.stringify(defaults));
    return defaults;
  });

  const [reservations, setReservations] = useState<ReservationItem[]>(() => {
    const raw = localStorage.getItem("aurum-reservations");
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaults: ReservationItem[] = [
      { id: "R-2048", guest: "Nimali Silva", room: "301", checkIn: "2026-05-16", checkOut: "2026-05-18", status: "Confirmed" },
      { id: "R-2051", guest: "Amal Perera", room: "102", checkIn: "2026-05-15", checkOut: "2026-05-17", status: "Checked In" },
      { id: "R-2054", guest: "Kasun Fernando", room: "201", checkIn: "2026-05-19", checkOut: "2026-05-21", status: "Pending" },
      { id: "R-2057", guest: "Priya Nair", room: "101", checkIn: "2026-05-22", checkOut: "2026-05-24", status: "Cancelled" },
    ];
    localStorage.setItem("aurum-reservations", JSON.stringify(defaults));
    return defaults;
  });

  const [customers, setCustomers] = useState<CustomerItem[]>(() => {
    const raw = localStorage.getItem("aurum-customers");
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaults: CustomerItem[] = [
      { id: "C-001", name: "Aurum Guest", tier: "Guest", email: "guest@aurumhotel.lk", stays: 2 },
      { id: "C-002", name: "Aurum VIP", tier: "VIP", email: "vip@aurumhotel.lk", stays: 9 },
      { id: "C-114", name: "Nimali Silva", tier: "VIP", email: "nimali@aurum.lk", stays: 5 },
      { id: "C-233", name: "Amal Perera", tier: "Guest", email: "amal@aurum.lk", stays: 1 },
    ];
    localStorage.setItem("aurum-customers", JSON.stringify(defaults));
    return defaults;
  });

  const [payments, setPayments] = useState<PaymentItem[]>(() => {
    const raw = localStorage.getItem("aurum-payments");
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaults: PaymentItem[] = [
      { id: "P-9001", guest: "Nimali Silva", amount: "LKR 850,000", method: "Card", status: "Paid" },
      { id: "P-9002", guest: "Amal Perera", amount: "LKR 150,000", method: "Pay at Hotel", status: "Pending" },
      { id: "P-9003", guest: "Kasun Fernando", amount: "LKR 280,000", method: "Bank Transfer", status: "Paid" },
      { id: "P-9004", guest: "Priya Nair", amount: "LKR 150,000", method: "Card", status: "Refunded" },
    ];
    localStorage.setItem("aurum-payments", JSON.stringify(defaults));
    return defaults;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const raw = localStorage.getItem("aurum-reviews");
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaults: ReviewItem[] = [
      { id: "RV-01", guest: "Nimali Silva", rating: 5, room: "301", status: "Approved", comment: "Exceptional suite, impeccable service." },
      { id: "RV-02", guest: "Amal Perera", rating: 4, room: "102", status: "Pending", comment: "Very elegant stay, breakfast was excellent." },
      { id: "RV-03", guest: "Kasun Fernando", rating: 3, room: "201", status: "Rejected", comment: "Service was good, but room prep was delayed." },
    ];
    localStorage.setItem("aurum-reviews", JSON.stringify(defaults));
    return defaults;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const raw = localStorage.getItem("aurum-services");
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    const defaults: ServiceItem[] = [
      { id: "S-01", name: "Royal Gold Facial", category: "Spa", status: "Busy", requests: 8 },
      { id: "S-02", name: "Airport Pickup", category: "Transport", status: "Available", requests: 5 },
      { id: "S-03", name: "Breakfast Buffet", category: "Dining", status: "Available", requests: 14 },
      { id: "S-04", name: "Infinity Pool Access", category: "Leisure", status: "Paused", requests: 0 },
    ];
    localStorage.setItem("aurum-services", JSON.stringify(defaults));
    return defaults;
  });

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function loadAllData() {
      setIsRefreshing(true);
      const db = await apiClient.loadDb();
      if (db) {
        if (db.rooms && db.rooms.length > 0) setRooms(db.rooms);
        if (db.reservations && db.reservations.length > 0) setReservations(db.reservations);
        if (db.customers && db.customers.length > 0) setCustomers(db.customers);
        if (db.payments && db.payments.length > 0) setPayments(db.payments);
        if (db.reviews && db.reviews.length > 0) setReviews(db.reviews);
        if (db.services && db.services.length > 0) setServices(db.services);
        setHasLoaded(true);
      } else {
        setHasLoaded(true);
      }
      setIsRefreshing(false);
    }
    loadAllData();
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      apiClient.syncCollection("rooms", rooms);
    }
  }, [rooms, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      apiClient.syncCollection("reservations", reservations);
    }
  }, [reservations, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      apiClient.syncCollection("customers", customers);
    }
  }, [customers, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      apiClient.syncCollection("payments", payments);
    }
  }, [payments, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      apiClient.syncCollection("reviews", reviews);
    }
  }, [reviews, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      apiClient.syncCollection("services", services);
    }
  }, [services, hasLoaded]);

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

  const deleteRoom = (id: number) => {
    if (!window.confirm(`Delete Room #${id}? This cannot be undone.`)) return;
    setRooms((prev) => prev.filter((room) => room.id !== id));
    addToast(`Room #${id} deleted`, "info");
  };

  const editRoom = (room: RoomItem) => {
    setEditingItem({
      id: room.id,
      data: {
        id: String(room.id),
        type: room.type,
        price: room.price,
        view: room.view,
        status: room.status,
      },
    });
  };

  const updateReservationStatus = (id: string, status: ReservationItem["status"]) => {
    setReservations((prev) => prev.map((reservation) => (reservation.id === id ? { ...reservation, status } : reservation)));
    addToast(`Reservation ${id} updated to ${status}`, "success");
  };

  const deleteReservation = (id: string) => {
    if (!window.confirm(`Delete reservation ${id}? This cannot be undone.`)) return;
    setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
    addToast(`Reservation ${id} deleted`, "info");
  };

  const editReservation = (reservation: ReservationItem) => {
    setEditingItem({
      id: reservation.id,
      data: {
        id: reservation.id,
        guest: reservation.guest,
        room: reservation.room,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: reservation.status,
      },
    });
  };

  const handleEditSave = (values: Record<string, string>) => {
    if (!editingItem) return;
    const id = editingItem.id;

    if (panel === "rooms") {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === id
            ? {
                id: parseInt(values.id, 10) || (id as number),
                type: values.type,
                price: values.price,
                view: values.view,
                status: values.status as RoomItem["status"],
              }
            : room
        )
      );
      addToast(`Room #${id} updated successfully`, "success");
    }

    if (panel === "reservations") {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id
            ? {
                id: values.id,
                guest: values.guest,
                room: values.room,
                checkIn: values.checkIn,
                checkOut: values.checkOut,
                status: values.status as ReservationItem["status"],
              }
            : reservation
        )
      );
      addToast(`Reservation ${id} updated successfully`, "success");
    }

    if (panel === "customers") {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === id
            ? {
                id: values.id,
                name: values.name,
                email: values.email,
                tier: values.tier as CustomerItem["tier"],
                stays: parseInt(values.stays, 10) || 0,
              }
            : customer
        )
      );
      addToast(`Customer ${id} updated successfully`, "success");
    }

    if (panel === "payments") {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? {
                id: values.id,
                guest: values.guest,
                amount: values.amount,
                method: values.method,
                status: values.status as PaymentItem["status"],
              }
            : payment
        )
      );
      addToast(`Payment ${id} updated successfully`, "success");
    }

    if (panel === "reviews") {
      const stars = (values.rating || "★★★★★").match(/★/g)?.length || 5;
      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? {
                ...review,
                guest: values.guest,
                room: values.room,
                rating: stars,
                status: values.status as ReviewItem["status"],
                comment: values.comment,
              }
            : review
        )
      );
      addToast(`Review ${id} updated successfully`, "success");
    }

    if (panel === "services") {
      setServices((prev) =>
        prev.map((service) =>
          service.id === id
            ? {
                ...service,
                id: values.id,
                name: values.name,
                category: values.category,
                status: values.status as ServiceItem["status"],
              }
            : service
        )
      );
      addToast(`Service ${id} updated successfully`, "success");
    }

    setEditingItem(null);
  };

  const upgradeCustomer = (id: string) => {
    setCustomers((prev) => prev.map((customer) => (customer.id === id ? { ...customer, tier: "VIP" } : customer)));
    addToast(`Customer ${id} upgraded to VIP`, "success");
  };

  const deleteCustomer = (id: string) => {
    if (!window.confirm(`Delete customer ${id}? This cannot be undone.`)) return;
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addToast(`Customer ${id} deleted`, "info");
  };

  const editCustomer = (customer: CustomerItem) => {
    setEditingItem({
      id: customer.id,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        tier: customer.tier,
        stays: String(customer.stays),
      },
    });
  };

  const updatePaymentStatus = (id: string, status: PaymentItem["status"]) => {
    setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, status } : payment)));
    addToast(`Payment ${id} marked as ${status}`, "success");
  };

  const deletePayment = (id: string) => {
    if (!window.confirm(`Delete payment ${id}? This cannot be undone.`)) return;
    setPayments((prev) => prev.filter((p) => p.id !== id));
    addToast(`Payment ${id} deleted`, "info");
  };

  const handleSaveCustomerNotes = (id: string, notes: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
    addToast("Guest profile remarks saved.", "success");
    setActiveProfileCustomer(null);
  };

  const handleExport = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const filename = `aurum-${panel}-snapshot-${new Date().toISOString().slice(0, 10)}.csv`;

    if (panel === "rooms") {
      headers = ["Room Number", "Room Type", "Rate Price", "View Option", "Status"];
      rows = rooms.map((r) => [String(r.id), r.type, r.price, r.view, r.status]);
    } else if (panel === "reservations") {
      headers = ["Reservation ID", "Guest Name", "Room Number", "Check-in Date", "Check-out Date", "Status"];
      rows = reservations.map((r) => [r.id, r.guest, r.room, r.checkIn, r.checkOut, r.status]);
    } else if (panel === "customers") {
      headers = ["Customer ID", "Guest Name", "Tier Level", "Email Address", "Total Stays"];
      rows = customers.map((c) => [c.id, c.name, c.tier, c.email, String(c.stays)]);
    } else if (panel === "payments") {
      headers = ["Payment ID", "Guest Name", "Charged Amount", "Method", "Status"];
      rows = payments.map((p) => [p.id, p.guest, p.amount, p.method, p.status]);
    } else if (panel === "reviews") {
      headers = ["Review ID", "Guest Name", "Rating Score", "Room", "Status", "Comment Feedback"];
      rows = reviews.map((r) => [r.id, r.guest, `${r.rating} Stars`, r.room, r.status, r.comment.replace(/"/g, '""')]);
    } else if (panel === "services") {
      headers = ["Service ID", "Service Name", "Category", "Status", "Total Requests"];
      rows = services.map((s) => [s.id, s.name, s.category, s.status, String(s.requests)]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Successfully exported active ${panel} database snapshot.`, "success");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const db = await apiClient.loadDb();
    if (db) {
      if (db.rooms) setRooms(db.rooms);
      if (db.reservations) setReservations(db.reservations);
      if (db.customers) setCustomers(db.customers);
      if (db.payments) setPayments(db.payments);
      if (db.reviews) setReviews(db.reviews);
      if (db.services) setServices(db.services);
      addToast(`Synchronized latest ${meta.title} database records from backend files.`, "success");
    } else {
      addToast(`Failed to load database. Synchronizing from local backup.`, "warning");
    }
    setIsRefreshing(false);
  };

  const editPayment = (payment: PaymentItem) => {
    setEditingItem({
      id: payment.id,
      data: {
        id: payment.id,
        guest: payment.guest,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
      },
    });
  };

  const moderateReview = (id: string, status: ReviewItem["status"]) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
    addToast(`Review ${id} changed to ${status}`, "success");
  };

  const deleteReview = (id: string) => {
    if (!window.confirm(`Delete review ${id}? This cannot be undone.`)) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast(`Review ${id} deleted`, "info");
  };

  const editReview = (review: ReviewItem) => {
    setEditingItem({
      id: review.id,
      data: {
        guest: review.guest,
        room: review.room,
        rating: `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} (${review.rating} Stars)`,
        status: review.status,
        comment: review.comment,
      },
    });
  };

  const pinReview = (id: string) => {
    addToast(`Review ${id} pinned to highlights`, "success");
  };

  const updateServiceStatus = (id: string, status: ServiceItem["status"]) => {
    setServices((prev) => prev.map((service) => (service.id === id ? { ...service, status } : service)));
    addToast(`Service ${id} updated to ${status}`, "success");
  };

  const deleteService = (id: string) => {
    if (!window.confirm(`Delete service ${id}? This cannot be undone.`)) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    addToast(`Service ${id} deleted`, "info");
  };

  const editService = (service: ServiceItem) => {
    setEditingItem({
      id: service.id,
      data: {
        id: service.id,
        name: service.name,
        category: service.category,
        status: service.status,
      },
    });
  };

  const meta = panelMeta[panel];

  // Close on Escape key + lock body scroll while panel is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !hideClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Build live analytics data based on actual panel data
  const analyticsData = useMemo<{
    title: string;
    stats: AnalyticsStat[];
    breakdowns: AnalyticsBreakdown[];
    insights: AnalyticsInsight[];
    timeline: { label: string; value: number }[];
  }>(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    switch (panel) {
      case "rooms": {
        const total = rooms.length;
        const available = rooms.filter((r) => r.status === "Available").length;
        const occupied = rooms.filter((r) => r.status === "Occupied").length;
        const maintenance = rooms.filter((r) => r.status === "Maintenance").length;
        const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

        // Group by type
        const byType: Record<string, number> = {};
        rooms.forEach((r) => {
          byType[r.type] = (byType[r.type] || 0) + 1;
        });

        return {
          title: "Rooms Analytics",
          stats: [
            { label: "Total Rooms", value: String(total), tone: "gold" },
            { label: "Occupancy Rate", value: `${occupancyRate}%`, trend: occupancyRate > 50 ? "↑ High demand" : "↓ Low demand", tone: "green" },
            { label: "Available", value: String(available), tone: "blue" },
            { label: "Maintenance", value: String(maintenance), tone: "amber" },
          ],
          breakdowns: Object.entries(byType).map(([type, count]) => ({
            label: type,
            value: count,
            total,
            tone: "gold" as const,
          })),
          insights: [
            { icon: "🏆", title: "Best Performing", detail: `${Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"} is your most common room type.` },
            { icon: "📊", title: "Occupancy Trend", detail: `${occupancyRate}% of rooms are currently occupied, ${available} available for new guests.` },
            { icon: "⚠️", title: "Maintenance Alert", detail: `${maintenance} room${maintenance !== 1 ? "s" : ""} need attention. Schedule cleaning to maximize availability.` },
            { icon: "💰", title: "Revenue Potential", detail: `If all ${available} available rooms book tonight, expected revenue: ~LKR ${(available * 200000).toLocaleString()}.` },
          ],
          timeline: days.map((d, i) => ({ label: d, value: Math.floor(occupied * (0.6 + i * 0.07)) })),
        };
      }

      case "reservations": {
        const total = reservations.length;
        const confirmed = reservations.filter((r) => r.status === "Confirmed").length;
        const pending = reservations.filter((r) => r.status === "Pending").length;
        const checkedIn = reservations.filter((r) => r.status === "Checked In").length;
        const cancelled = reservations.filter((r) => r.status === "Cancelled").length;

        return {
          title: "Reservations Analytics",
          stats: [
            { label: "Total Bookings", value: String(total), tone: "gold" },
            { label: "Confirmed", value: String(confirmed), trend: "↑ Active", tone: "green" },
            { label: "Pending", value: String(pending), tone: "amber" },
            { label: "Cancelled", value: String(cancelled), trend: cancelled > 2 ? "↑ Review" : "Stable", tone: "red" },
          ],
          breakdowns: [
            { label: "Confirmed", value: confirmed, total, tone: "green" },
            { label: "Checked In", value: checkedIn, total, tone: "blue" },
            { label: "Pending", value: pending, total, tone: "amber" },
            { label: "Cancelled", value: cancelled, total, tone: "red" },
          ],
          insights: [
            { icon: "📅", title: "Booking Volume", detail: `${total} active reservation${total !== 1 ? "s" : ""} in the system. Confirmed rate: ${total > 0 ? Math.round((confirmed / total) * 100) : 0}%.` },
            { icon: "🔄", title: "Conversion Health", detail: `${pending} pending booking${pending !== 1 ? "s" : ""} need follow-up to convert into confirmations.` },
            { icon: "⏱️", title: "Check-in Status", detail: `${checkedIn} guest${checkedIn !== 1 ? "s are" : " is"} currently in-house at the hotel.` },
            { icon: "📉", title: "Cancellation Rate", detail: `${total > 0 ? Math.round((cancelled / total) * 100) : 0}% cancellation. Industry average is 15-20%.` },
          ],
          timeline: days.map((d, i) => ({ label: d, value: Math.floor(total * (0.4 + i * 0.1)) })),
        };
      }

      case "customers": {
        const total = customers.length;
        const vip = customers.filter((c) => c.tier === "VIP").length;
        const guest = customers.filter((c) => c.tier === "Guest").length;
        const repeat = customers.filter((c) => c.stays > 1).length;
        const avgStays = total > 0 ? (customers.reduce((sum, c) => sum + c.stays, 0) / total).toFixed(1) : "0";

        return {
          title: "Customers Analytics",
          stats: [
            { label: "Total Guests", value: String(total), tone: "gold" },
            { label: "VIP Members", value: String(vip), trend: `${total > 0 ? Math.round((vip / total) * 100) : 0}% VIP rate`, tone: "green" },
            { label: "Repeat Guests", value: String(repeat), tone: "blue" },
            { label: "Avg Stays", value: avgStays, tone: "amber" },
          ],
          breakdowns: [
            { label: "VIP Tier", value: vip, total, tone: "green" },
            { label: "Standard Guests", value: guest, total, tone: "blue" },
            { label: "Repeat Visitors", value: repeat, total, tone: "gold" },
          ],
          insights: [
            { icon: "⭐", title: "VIP Distribution", detail: `${vip} VIP guest${vip !== 1 ? "s" : ""} out of ${total}. Consider VIP upgrade campaigns.` },
            { icon: "🔁", title: "Loyalty Rate", detail: `${total > 0 ? Math.round((repeat / total) * 100) : 0}% of customers are repeat visitors — excellent retention.` },
            { icon: "📈", title: "Engagement Average", detail: `Each guest averages ${avgStays} stays. Target: 3+ for VIP promotion.` },
            { icon: "💎", title: "Top Spender", detail: `${customers.sort((a, b) => b.stays - a.stays)[0]?.name || "N/A"} has the most stays. Send a personalized thank-you.` },
          ],
          timeline: days.map((d, i) => ({ label: d, value: Math.floor(total * (0.3 + i * 0.12)) })),
        };
      }

      case "payments": {
        const total = payments.length;
        const paid = payments.filter((p) => p.status === "Paid").length;
        const pending = payments.filter((p) => p.status === "Pending").length;
        const refunded = payments.filter((p) => p.status === "Refunded").length;

        const totalRevenue = payments
          .filter((p) => p.status === "Paid")
          .reduce((sum, p) => sum + parseInt(p.amount.replace(/[^\d]/g, ""), 10), 0);

        const byMethod: Record<string, number> = {};
        payments.forEach((p) => {
          byMethod[p.method] = (byMethod[p.method] || 0) + 1;
        });

        return {
          title: "Payments Analytics",
          stats: [
            { label: "Total Revenue", value: `LKR ${(totalRevenue / 1000000).toFixed(1)}M`, trend: "↑ Strong", tone: "green" },
            { label: "Transactions", value: String(total), tone: "gold" },
            { label: "Pending", value: String(pending), tone: "amber" },
            { label: "Refunded", value: String(refunded), tone: "red" },
          ],
          breakdowns: Object.entries(byMethod).map(([method, count]) => ({
            label: method,
            value: count,
            total,
            tone: "gold" as const,
          })),
          insights: [
            { icon: "💰", title: "Revenue Snapshot", detail: `LKR ${totalRevenue.toLocaleString()} processed across ${paid} paid transaction${paid !== 1 ? "s" : ""}.` },
            { icon: "💳", title: "Top Payment Method", detail: `${Object.entries(byMethod).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"} is your most-used payment method.` },
            { icon: "⏳", title: "Pending Actions", detail: `${pending} payment${pending !== 1 ? "s" : ""} awaiting completion. Send payment reminders.` },
            { icon: "🔄", title: "Refund Rate", detail: `${total > 0 ? Math.round((refunded / total) * 100) : 0}% refund rate. Healthy threshold: under 5%.` },
          ],
          timeline: days.map((d, i) => ({ label: d, value: Math.floor(paid * (0.5 + i * 0.08)) })),
        };
      }

      case "reviews": {
        const total = reviews.length;
        const approved = reviews.filter((r) => r.status === "Approved").length;
        const pending = reviews.filter((r) => r.status === "Pending").length;
        const rejected = reviews.filter((r) => r.status === "Rejected").length;
        const avgRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : "0";

        const byRating: Record<number, number> = {};
        reviews.forEach((r) => {
          byRating[r.rating] = (byRating[r.rating] || 0) + 1;
        });

        return {
          title: "Reviews Analytics",
          stats: [
            { label: "Average Rating", value: `${avgRating} / 5`, trend: parseFloat(avgRating) >= 4 ? "↑ Excellent" : "↓ Improve", tone: parseFloat(avgRating) >= 4 ? "green" : "amber" },
            { label: "Total Reviews", value: String(total), tone: "gold" },
            { label: "Pending Moderation", value: String(pending), tone: "amber" },
            { label: "Approval Rate", value: `${total > 0 ? Math.round((approved / total) * 100) : 0}%`, tone: "green" },
          ],
          breakdowns: [5, 4, 3, 2, 1].map((stars) => ({
            label: `${stars} Star${stars > 1 ? "s" : ""}`,
            value: byRating[stars] || 0,
            total,
            tone: (stars >= 4 ? "green" : stars === 3 ? "amber" : "red") as "green" | "amber" | "red",
          })),
          insights: [
            { icon: "⭐", title: "Guest Satisfaction", detail: `Average rating ${avgRating}/5 across ${total} review${total !== 1 ? "s" : ""}. ${parseFloat(avgRating) >= 4 ? "Outstanding!" : "Focus on improvement areas."}` },
            { icon: "📋", title: "Moderation Queue", detail: `${pending} review${pending !== 1 ? "s" : ""} awaiting approval. Aim to moderate within 24 hours.` },
            { icon: "❌", title: "Rejection Rate", detail: `${rejected} review${rejected !== 1 ? "s" : ""} rejected. Review moderation criteria for consistency.` },
            { icon: "🎯", title: "Top Sentiment", detail: `Most guests rate Aurum ${Object.entries(byRating).sort((a, b) => b[1] - a[1])[0]?.[0] || "5"} stars — celebrate this on socials!` },
          ],
          timeline: days.map((d, i) => ({ label: d, value: Math.floor(approved * (0.3 + i * 0.12)) })),
        };
      }

      case "services": {
        const total = services.length;
        const available = services.filter((s) => s.status === "Available").length;
        const busy = services.filter((s) => s.status === "Busy").length;
        const paused = services.filter((s) => s.status === "Paused").length;
        const totalRequests = services.reduce((sum, s) => sum + s.requests, 0);

        const byCategory: Record<string, number> = {};
        services.forEach((s) => {
          byCategory[s.category] = (byCategory[s.category] || 0) + s.requests;
        });

        return {
          title: "Services Analytics",
          stats: [
            { label: "Total Requests", value: String(totalRequests), trend: "↑ Active", tone: "gold" },
            { label: "Available", value: String(available), tone: "green" },
            { label: "Busy Now", value: String(busy), tone: "amber" },
            { label: "Paused", value: String(paused), tone: "red" },
          ],
          breakdowns: Object.entries(byCategory).map(([cat, count]) => ({
            label: cat,
            value: count,
            total: totalRequests || 1,
            tone: "gold" as const,
          })),
          insights: [
            { icon: "🎯", title: "Top Category", detail: `${Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"} receives the most guest requests.` },
            { icon: "🔥", title: "Most Popular", detail: `${services.sort((a, b) => b.requests - a.requests)[0]?.name || "N/A"} is the trending service with ${services.sort((a, b) => b.requests - a.requests)[0]?.requests || 0} requests.` },
            { icon: "⏸️", title: "Paused Services", detail: `${paused} service${paused !== 1 ? "s are" : " is"} paused. Reactivate to drive revenue.` },
            { icon: "📦", title: "Service Coverage", detail: `${total} total services across ${Object.keys(byCategory).length} categories.` },
          ],
          timeline: days.map((d, i) => ({ label: d, value: Math.floor(totalRequests * (0.1 + i * 0.05)) })),
        };
      }

      default:
        return { title: "Analytics", stats: [], breakdowns: [], insights: [], timeline: [] };
    }
  }, [panel, rooms, reservations, customers, payments, reviews, services]);

  // Form configs for each panel's "Add New" modal
  const formConfigs: Record<AdminPanelKey, { title: string; fields: FormField[] }> = {
    rooms: {
      title: "Add New Room",
      fields: [
        { name: "id", label: "Room Number", type: "number", placeholder: "e.g. 401" },
        { name: "type", label: "Room Type", type: "select", options: ["Deluxe Room", "Executive Suite", "Presidential Suite", "Standard Room"] },
        { name: "price", label: "Rate (LKR)", type: "text", placeholder: "e.g. LKR 150,000" },
        { name: "view", label: "View", type: "select", options: ["City View", "Garden View", "Ocean View", "Panoramic View"] },
        { name: "status", label: "Status", type: "select", options: ["Available", "Occupied", "Maintenance"] },
      ],
    },
    reservations: {
      title: "Add New Reservation",
      fields: [
        { name: "id", label: "Reservation ID", type: "text", placeholder: "e.g. R-2099" },
        { name: "guest", label: "Guest Name", type: "text", placeholder: "e.g. Nimali Silva" },
        { name: "room", label: "Room Number", type: "text", placeholder: "e.g. 301" },
        { name: "checkIn", label: "Check-in Date", type: "date" },
        { name: "checkOut", label: "Check-out Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: ["Confirmed", "Pending", "Checked In", "Cancelled"] },
      ],
    },
    customers: {
      title: "Add New Customer",
      fields: [
        { name: "id", label: "Customer ID", type: "text", placeholder: "e.g. C-999" },
        { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Amal Perera" },
        { name: "email", label: "Email Address", type: "email", placeholder: "guest@example.lk", fullWidth: true },
        { name: "tier", label: "Tier", type: "select", options: ["Guest", "VIP"] },
        { name: "stays", label: "Total Stays", type: "number", placeholder: "0" },
      ],
    },
    payments: {
      title: "Add New Payment",
      fields: [
        { name: "id", label: "Payment ID", type: "text", placeholder: "e.g. P-9999" },
        { name: "guest", label: "Guest Name", type: "text", placeholder: "e.g. Nimali Silva" },
        { name: "amount", label: "Amount", type: "text", placeholder: "e.g. LKR 150,000" },
        { name: "method", label: "Payment Method", type: "select", options: ["Card", "Cash", "Bank Transfer", "Pay at Hotel"] },
        { name: "status", label: "Status", type: "select", options: ["Paid", "Pending", "Refunded"] },
      ],
    },
    reviews: {
      title: "Add New Review",
      fields: [
        { name: "guest", label: "Guest Name", type: "text", placeholder: "e.g. Nimali Silva" },
        { name: "room", label: "Room Number", type: "text", placeholder: "e.g. 301" },
        { name: "rating", label: "Rating", type: "select", options: ["★★★★★ (5 Stars)", "★★★★☆ (4 Stars)", "★★★☆☆ (3 Stars)", "★★☆☆☆ (2 Stars)", "★☆☆☆☆ (1 Star)"] },
        { name: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Rejected"] },
        { name: "comment", label: "Comment", type: "textarea", placeholder: "Share feedback comments...", fullWidth: true },
      ],
    },
    services: {
      title: "Add New Service",
      fields: [
        { name: "id", label: "Service ID", type: "text", placeholder: "e.g. S-99" },
        { name: "name", label: "Service Name", type: "text", placeholder: "e.g. Royal Gold Facial" },
        { name: "category", label: "Category", type: "select", options: ["Spa", "Dining", "Transport", "Leisure", "Other"] },
        { name: "status", label: "Status", type: "select", options: ["Available", "Busy", "Paused"] },
      ],
    },
  };

  const handleCreate = (values: Record<string, string>) => {
    switch (panel) {
      case "rooms":
        setRooms((prev) => [
          ...prev,
          {
            id: parseInt(values.id, 10) || prev.length + 100,
            type: values.type,
            price: values.price,
            status: (values.status as RoomItem["status"]) || "Available",
            view: values.view,
          },
        ]);
        break;
      case "reservations":
        setReservations((prev) => [
          ...prev,
          {
            id: values.id || `R-${Date.now()}`,
            guest: values.guest,
            room: values.room,
            checkIn: values.checkIn,
            checkOut: values.checkOut,
            status: (values.status as ReservationItem["status"]) || "Confirmed",
          },
        ]);
        break;
      case "customers":
        setCustomers((prev) => [
          ...prev,
          {
            id: values.id || `C-${Date.now()}`,
            name: values.name,
            tier: (values.tier as CustomerItem["tier"]) || "Guest",
            email: values.email,
            stays: parseInt(values.stays, 10) || 0,
          },
        ]);
        break;
      case "payments":
        setPayments((prev) => [
          ...prev,
          {
            id: values.id || `P-${Date.now()}`,
            guest: values.guest,
            amount: values.amount,
            method: values.method,
            status: (values.status as PaymentItem["status"]) || "Paid",
          },
        ]);
        break;
      case "reviews": {
        const stars = (values.rating || "★★★★★").match(/★/g)?.length || 5;
        setReviews((prev) => [
          ...prev,
          {
            id: `RV-${Date.now().toString().slice(-4)}`,
            guest: values.guest,
            rating: stars,
            room: values.room,
            status: (values.status as ReviewItem["status"]) || "Pending",
            comment: values.comment,
          },
        ]);
        break;
      }
      case "services":
        setServices((prev) => [
          ...prev,
          {
            id: values.id || `S-${Date.now().toString().slice(-3)}`,
            name: values.name,
            category: values.category,
            status: (values.status as ServiceItem["status"]) || "Available",
            requests: 0,
          },
        ]);
        break;
    }
    addToast(`${formConfigs[panel].title} added successfully`, "success");
    setShowAddModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-[260] bg-black/85 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6 animate-[fadeIn_0.25s_ease-out]"
      onClick={hideClose ? undefined : onClose}
    >
      <div
        className={`relative my-4 w-full max-w-7xl border border-gold-500/20 bg-gradient-to-br ${meta.tone} backdrop-blur-xl shadow-2xl shadow-black/60`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky close button */}
        {!hideClose && (
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
        )}

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
              onClick={handleExport}
              className="px-4 py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black uppercase tracking-widest text-xs transition-all duration-300"
            >
              Export
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-3 border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white uppercase tracking-widest text-xs transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation pills */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-white/10 bg-black/20">
          {visibleNavItems.map((item) => (
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
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300"
            >
              Add New
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="px-5 py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 font-semibold uppercase tracking-widest text-xs transition-all duration-300"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Dynamic panel content */}
        <div className="p-4 sm:p-6 relative min-h-[300px]">
          {isRefreshing && (
            <div className="absolute inset-0 bg-[#0A0A0C]/75 backdrop-blur-xs z-50 flex flex-col items-center justify-center space-y-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Synchronizing database...</div>
            </div>
          )}
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
                    <MiniAction onClick={() => editRoom(room)}>Edit</MiniAction>
                    <MiniAction onClick={() => deleteRoom(room.id)} variant="danger">Delete</MiniAction>
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
                    <MiniAction onClick={() => editReservation(reservation)}>Edit</MiniAction>
                    <MiniAction onClick={() => deleteReservation(reservation.id)} variant="danger">Delete</MiniAction>
                    <MiniAction onClick={() => updateReservationStatus(reservation.id, "Confirmed")}>Confirm</MiniAction>
                    <MiniAction onClick={() => updateReservationStatus(reservation.id, "Checked In")}>Check In</MiniAction>
                    <MiniAction onClick={() => updateReservationStatus(reservation.id, "Cancelled")} variant="danger">Cancel</MiniAction>
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
                    <MiniAction onClick={() => editCustomer(customer)}>Edit</MiniAction>
                    <MiniAction onClick={() => deleteCustomer(customer.id)} variant="danger">Delete</MiniAction>
                    <MiniAction onClick={() => setActiveProfileCustomer(customer)}>Profile</MiniAction>
                    {customer.tier === "Guest" ? (
                      <MiniAction onClick={() => upgradeCustomer(customer.id)}>Upgrade VIP</MiniAction>
                    ) : (
                      <MiniAction onClick={() => handleGeneric(`VIP care team notified for ${customer.name}`)}>VIP Care</MiniAction>
                    )}
                    <MiniAction onClick={() => setActiveMessageCustomer(customer)}>Message</MiniAction>
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
                    <MiniAction onClick={() => editPayment(payment)}>Edit</MiniAction>
                    <MiniAction onClick={() => deletePayment(payment.id)} variant="danger">Delete</MiniAction>
                    <MiniAction onClick={() => updatePaymentStatus(payment.id, "Paid")}>Mark Paid</MiniAction>
                    <MiniAction onClick={() => updatePaymentStatus(payment.id, "Refunded")} variant="danger">Refund</MiniAction>
                    <MiniAction onClick={() => setActiveInvoicePayment(payment)}>Invoice</MiniAction>
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
                      <MiniAction onClick={() => moderateReview(review.id, "Approved")} variant="primary">Approve</MiniAction>
                      <MiniAction onClick={() => moderateReview(review.id, "Rejected")} variant="danger">Reject</MiniAction>
                      <MiniAction onClick={() => editReview(review)}>Edit</MiniAction>
                      <MiniAction onClick={() => deleteReview(review.id)} variant="danger">Delete</MiniAction>
                      <MiniAction onClick={() => pinReview(review.id)}>Pin</MiniAction>
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
                    <MiniAction onClick={() => editService(service)}>Edit</MiniAction>
                    <MiniAction onClick={() => deleteService(service.id)} variant="danger">Delete</MiniAction>
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

      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
        title={formConfigs[panel].title}
        panelLabel={`${meta.title.replace(" Panel", "").toUpperCase()} PANEL`}
        fields={formConfigs[panel].fields}
      />

      <AddItemModal
        open={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSubmit={handleEditSave}
        title={`Edit ${panel === "rooms" ? "Room" : panel === "reservations" ? "Reservation" : "Item"}`}
        panelLabel={`${meta.title.replace(" Panel", "").toUpperCase()} PANEL`}
        fields={
          editingItem
            ? formConfigs[panel].fields.map((f) => ({
                ...f,
                defaultValue: editingItem.data[f.name] ?? "",
              }))
            : []
        }
      />

      <AnalyticsModal
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        title={analyticsData.title}
        panelLabel={`${meta.title.replace(" Panel", "").toUpperCase()} PANEL`}
        stats={analyticsData.stats}
        breakdowns={analyticsData.breakdowns}
        insights={analyticsData.insights}
        timeline={analyticsData.timeline}
      />

      <CustomerProfileModal
        open={activeProfileCustomer !== null}
        onClose={() => setActiveProfileCustomer(null)}
        customer={activeProfileCustomer}
        onSaveNotes={handleSaveCustomerNotes}
      />

      <CustomerMessageModal
        open={activeMessageCustomer !== null}
        onClose={() => setActiveMessageCustomer(null)}
        customerName={activeMessageCustomer?.name ?? ""}
        customerEmail={activeMessageCustomer?.email ?? ""}
      />

      <InvoiceModal
        open={activeInvoicePayment !== null}
        onClose={() => setActiveInvoicePayment(null)}
        invoiceData={activeInvoicePayment}
      />
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

function MiniAction({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "primary";
}) {
  const styles =
    variant === "danger"
      ? "border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white"
      : variant === "primary"
      ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white"
      : "border-gold-500/25 text-gold-400 hover:bg-gold-500 hover:text-black";

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 border text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${styles}`}
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
