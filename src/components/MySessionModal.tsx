import { useEffect, useMemo, useState } from "react";
import { useSession, type ActivityType } from "../context/SessionContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import { InvoiceModal } from "./ManagementModals";

const ACTIVITY_META: Record<ActivityType, { icon: string; label: string; tone: string }> = {
  login:           { icon: "🔓", label: "Sign In",          tone: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  logout:          { icon: "🔒", label: "Sign Out",         tone: "text-gray-300 border-white/15 bg-white/5" },
  booking:         { icon: "📅", label: "Booking",          tone: "text-gold-400 border-gold-500/30 bg-gold-500/10" },
  "view-tour":     { icon: "🎬", label: "Virtual Tour",     tone: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  "view-room":     { icon: "🛏️", label: "Room View",       tone: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  "view-menu":     { icon: "🍽️", label: "Menu",            tone: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  "spa-request":   { icon: "💆", label: "Spa Request",      tone: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  "event-inquiry": { icon: "✨", label: "Event Inquiry",    tone: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  review:          { icon: "⭐", label: "Review",           tone: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  payment:         { icon: "💳", label: "Payment",          tone: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  "profile-update":{ icon: "👤", label: "Profile",          tone: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  "page-visit":    { icon: "📍", label: "Page Visit",       tone: "text-gray-400 border-white/10 bg-white/5" },
};

type Filter = "all" | ActivityType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "booking", label: "Bookings" },
  { key: "view-tour", label: "Tours" },
  { key: "view-room", label: "Rooms" },
  { key: "spa-request", label: "Spa" },
  { key: "review", label: "Reviews" },
  { key: "payment", label: "Payments" },
];

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFullTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MySessionModal() {
  const { isSessionOpen, closeSession, activities, clearHistory } = useSession();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleViewInvoice = (activity: any) => {
    const rawAmount = activity.meta?.amount || activity.meta?.total || "LKR 150,000";
    const rawMethod = activity.meta?.method || "Card";
    const rawStatus = activity.meta?.status || "Paid";
    setSelectedInvoice({
      id: activity.id.replace("act-", "P-"),
      guest: user?.name || "Guest",
      amount: String(rawAmount),
      method: String(rawMethod),
      status: rawStatus as "Paid" | "Pending" | "Refunded",
      date: new Date(activity.timestamp).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSession();
    };
    if (isSessionOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSessionOpen, closeSession]);

  const filtered = useMemo(() => {
    if (filter === "all") return activities;
    return activities.filter((a) => a.type === filter);
  }, [activities, filter]);

  const stats = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const a of activities) {
      totals[a.type] = (totals[a.type] || 0) + 1;
    }
    return {
      total: activities.length,
      bookings: totals["booking"] || 0,
      tours: totals["view-tour"] || 0,
      spa: totals["spa-request"] || 0,
      reviews: totals["review"] || 0,
      sessionStart: activities.length > 0 ? activities[activities.length - 1].timestamp : Date.now(),
    };
  }, [activities]);

  const handleClear = () => {
    if (window.confirm("Clear your entire activity history? This cannot be undone.")) {
      clearHistory();
      addToast("Activity history cleared.", "info");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aurum-session-${user?.email}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("Session history downloaded.", "success");
  };

  if (!isSessionOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-[260] bg-black/85 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6 animate-[fadeIn_0.25s_ease-out]"
      onClick={closeSession}
    >
      <div
        className="relative my-4 w-full max-w-5xl bg-dark-500 border border-gold-500/20 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeSession}
          className="absolute top-4 right-4 z-30 w-11 h-11 border border-white/10 bg-black/40 text-white hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 flex items-center justify-center"
          aria-label="Close session"
          title="Close (Esc)"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pr-20 border-b border-white/10 bg-gradient-to-br from-gold-500/10 to-transparent">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gold-500 text-black flex items-center justify-center font-display font-bold text-4xl shrink-0 shadow-lg shadow-gold-500/30">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-2">
                My Session History
              </div>
              <h2 className="font-display text-3xl text-white font-bold">{user.name}</h2>
              <div className="text-sm text-gray-400 mt-1">{user.email}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-gold-500/30 bg-gold-500/10 text-gold-400">
                  {user.role}
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-white/10 bg-white/5 text-gray-300">
                  Active session
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-white/10">
          {[
            { label: "Total Activities", value: stats.total },
            { label: "Bookings", value: stats.bookings },
            { label: "Tours Viewed", value: stats.tours },
            { label: "Reviews Posted", value: stats.reviews },
          ].map((s) => (
            <div key={s.label} className="bg-dark-300 border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500 mb-2">{s.label}</div>
              <div className="font-display text-3xl text-gold-400 font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/10 bg-black/20">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-[11px] uppercase tracking-widest border transition-all duration-300 ${
                  filter === f.key
                    ? "bg-gold-500 text-black border-gold-500"
                    : "bg-white/5 text-gray-300 border-white/10 hover:border-gold-500/30 hover:text-gold-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-[11px] uppercase tracking-widest border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black transition-all duration-300"
            >
              Export
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 text-[11px] uppercase tracking-widest border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Activity timeline */}
        <div className="p-6 max-h-[55vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="font-display text-xl text-white font-bold mb-2">No activity yet</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Start exploring Aurum! Make a booking, take the virtual tour, or browse our luxury rooms to see your activity here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((activity) => {
                const meta = ACTIVITY_META[activity.type];
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-dark-300 border border-white/10 hover:border-gold-500/30 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl shrink-0 ${meta.tone}`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="font-semibold text-white">{activity.title}</h4>
                        <span
                          className="text-[10px] uppercase tracking-widest text-gray-500 shrink-0 cursor-help"
                          title={formatFullTime(activity.timestamp)}
                        >
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">{activity.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2 w-full">
                        <span className={`inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-widest border ${meta.tone}`}>
                          {meta.label}
                        </span>
                        {activity.meta &&
                          Object.entries(activity.meta).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-widest border border-white/10 bg-white/5 text-gray-400"
                            >
                              {key}: <span className="text-gold-400 ml-1">{value}</span>
                            </span>
                          ))}
                        {(activity.type === "payment" || activity.type === "booking") && (
                          <button
                            onClick={() => handleViewInvoice(activity)}
                            className="ml-auto px-2.5 py-1 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black text-[9px] uppercase tracking-widest transition-all duration-300"
                          >
                            View Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Session started {formatTime(stats.sessionStart)}
          </div>
          <button
            onClick={closeSession}
            className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-black uppercase tracking-widest text-xs font-semibold transition-all duration-300"
          >
            Continue Browsing
          </button>
        </div>
      </div>

      <InvoiceModal
        open={selectedInvoice !== null}
        onClose={() => setSelectedInvoice(null)}
        invoiceData={selectedInvoice}
      />
    </div>
  );
}
