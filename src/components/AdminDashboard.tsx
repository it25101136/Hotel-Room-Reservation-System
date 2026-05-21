import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import AdminWorkspace, { type AdminPanelKey } from "./AdminWorkspace";

const stats = [
  { label: "Active Reservations", value: "142", sub: "+18 this week", accent: "text-gold-400" },
  { label: "Occupancy Rate", value: "87%", sub: "12 suites left", accent: "text-emerald-400" },
  { label: "Monthly Revenue", value: "LKR 18.4M", sub: "+12.6% vs last month", accent: "text-sky-400" },
  { label: "Guest Satisfaction", value: "4.8/5", sub: "218 approved reviews", accent: "text-violet-400" },
  { label: "VIP Guests", value: "38", sub: "Premium returning clients", accent: "text-amber-400" },
  { label: "Service Requests", value: "96", sub: "14 pending right now", accent: "text-rose-400" },
];

const quickActions: {
  title: string;
  desc: string;
  action: string;
  icon: string;
  panel: AdminPanelKey;
}[] = [
  {
    title: "Room Management",
    desc: "Add, update, search and remove room inventory.",
    action: "Open Rooms Panel",
    icon: "🛏️",
    panel: "rooms",
  },
  {
    title: "Reservation Control",
    desc: "Sort, edit and monitor all guest reservations.",
    action: "Open Reservations",
    icon: "📅",
    panel: "reservations",
  },
  {
    title: "Customer Directory",
    desc: "Search guests, upgrade VIPs and update customer records.",
    action: "Open Customers",
    icon: "👤",
    panel: "customers",
  },
  {
    title: "Payment Oversight",
    desc: "Track invoices, payment status and billing history.",
    action: "Open Payments",
    icon: "💳",
    panel: "payments",
  },
  {
    title: "Reviews Moderation",
    desc: "Approve, reject and review guest feedback submissions.",
    action: "Open Reviews",
    icon: "⭐",
    panel: "reviews",
  },
  {
    title: "Facilities & Services",
    desc: "Manage spa, dining, transport and add-on requests.",
    action: "Open Services",
    icon: "🧖",
    panel: "services",
  },
];

const revenueChannels = [
  { name: "Rooms & Suites", percent: 58, amount: "LKR 10.7M" },
  { name: "Dining", percent: 18, amount: "LKR 3.3M" },
  { name: "Spa & Wellness", percent: 12, amount: "LKR 2.2M" },
  { name: "Events & Weddings", percent: 9, amount: "LKR 1.7M" },
  { name: "Other Services", percent: 3, amount: "LKR 0.5M" },
];

const recentActivities = [
  "Presidential Suite reservation confirmed for 14–16 Feb.",
  "Wedding brochure request received for Rooftop Terrace.",
  "3 new verified reviews approved by moderation team.",
  "Spa package request added by VIP guest Nimali Silva.",
  "Airport pickup marked delivered for Reservation #1002.",
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const [activePanel, setActivePanel] = useState<AdminPanelKey | null>(null);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const handleAction = (label: string) => {
    addToast(`${label} loaded for admin access.`, "info");
  };

  const handleExport = () => {
    addToast("Analytics report export started. PDF will be ready shortly.", "success");
  };

  const handleSignOut = () => {
    addToast("Admin signed out successfully.", "info");
    signOut();
  };

  return (
    <div className="min-h-screen bg-dark-500 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,168,83,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(212,168,83,0.08),_transparent_26%)]" />
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-gold-500/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-gold-400 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-gold-400">A</span>
              </div>
              <div>
                <div className="font-display text-2xl tracking-wider">AURUM</div>
                <div className="text-xs uppercase tracking-[0.28em] text-gold-400">Admin Statistics Dashboard</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.22em] text-gold-400">Logged in as</div>
                <div className="text-sm font-medium">{user?.name ?? "Admin"}</div>
              </div>
              <button
                onClick={handleExport}
                className="px-5 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
              >
                Export Report
              </button>
              <button
                onClick={handleSignOut}
                className="px-5 py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Hero / intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-stretch">
            <div className="bg-gradient-to-br from-dark-300 to-dark-400 border border-gold-500/20 p-8 shadow-2xl shadow-black/30">
              <div className="inline-flex items-center gap-2 border border-gold-500/20 bg-gold-500/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-gold-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Status: Healthy
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-white font-bold mt-6 leading-tight">
                Welcome back,
                <span className="block gold-shimmer mt-2">{user?.name ?? "Administrator"}</span>
              </h1>
              <p className="text-gray-400 mt-5 max-w-2xl leading-relaxed">
                Monitor operations across reservations, rooms, revenue, reviews and luxury services.
                This dashboard gives you a real-time executive view of Aurum Hotel performance in Colombo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                <span className="px-3 py-2 border border-white/10 bg-white/5">{today}</span>
                <span className="px-3 py-2 border border-white/10 bg-white/5">Role: {user?.role ?? "admin"}</span>
                <span className="px-3 py-2 border border-white/10 bg-white/5">Timezone: Asia/Colombo</span>
              </div>
            </div>

            <div className="bg-dark-300 border border-gold-500/20 p-6 shadow-2xl shadow-black/30">
              <div className="text-xs uppercase tracking-[0.22em] text-gold-400 mb-3">Operations Snapshot</div>
              <div className="space-y-4">
                {[
                  ["Check-ins Today", "18"],
                  ["Pending Approvals", "07"],
                  ["Open Inquiries", "24"],
                  ["Unresolved Tickets", "03"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-sm">{label}</span>
                    <span className="font-display text-2xl text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {stats.map((item) => (
              <div key={item.label} className="bg-dark-300 border border-white/10 hover:border-gold-500/40 transition-all duration-300 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/10">
                <div className="text-xs uppercase tracking-[0.22em] text-gray-500">{item.label}</div>
                <div className={`font-display text-4xl mt-3 font-bold ${item.accent}`}>{item.value}</div>
                <div className="text-sm text-gray-400 mt-2">{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Main analytics */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid xl:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* Revenue panel */}
          <div className="bg-dark-300 border border-gold-500/20 p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-gold-400">Revenue Composition</div>
                <h2 className="font-display text-2xl text-white font-bold mt-2">Department Performance</h2>
              </div>
              <button
                onClick={() => handleAction("Revenue insights")}
                className="px-4 py-2 text-xs uppercase tracking-widest border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black transition-all duration-300"
              >
                View Insights
              </button>
            </div>

            <div className="space-y-5">
              {revenueChannels.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300">{channel.name}</span>
                    <span className="text-gold-400 font-medium">{channel.amount}</span>
                  </div>
                  <div className="h-3 bg-black/30 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-700"
                      style={{ width: `${channel.percent}%` }}
                    />
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mt-2">{channel.percent}% contribution</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity panel */}
          <div className="space-y-6">
            <div className="bg-dark-300 border border-gold-500/20 p-6 shadow-xl shadow-black/30">
              <div className="text-xs uppercase tracking-[0.22em] text-gold-400">Recent Activity</div>
              <h2 className="font-display text-2xl text-white font-bold mt-2 mb-5">Live Updates</h2>
              <div className="space-y-4">
                {recentActivities.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="text-sm text-gray-300 leading-relaxed">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-300 border border-gold-500/20 p-6 shadow-xl shadow-black/30">
              <div className="text-xs uppercase tracking-[0.22em] text-gold-400">System Health</div>
              <h2 className="font-display text-2xl text-white font-bold mt-2 mb-5">Platform Status</h2>
              <div className="space-y-4">
                {[
                  ["Frontend Website", "Operational", "green"],
                  ["Booking System", "Operational", "green"],
                  ["Payment Gateway", "Standby", "amber"],
                  ["Review Moderation", "Operational", "green"],
                ].map(([label, status, tone]) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <span className="text-gray-300 text-sm">{label}</span>
                    <span className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest ${
                      tone === "green" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${tone === "green" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-gold-400">Admin Actions</div>
              <h2 className="font-display text-2xl text-white font-bold mt-2">Quick Management Panels</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {quickActions.map((card) => (
              <div key={card.title} className="bg-dark-300 border border-white/10 hover:border-gold-500/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/10">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-display text-xl text-white font-bold">{card.title}</h3>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">{card.desc}</p>
                <button
                  onClick={() => {
                    handleAction(card.title);
                    setActivePanel(card.panel);
                  }}
                  className="mt-6 px-5 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 flex items-center gap-2"
                >
                  {card.action}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h6v6M10 14L21 3M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating popup workspace */}
      {activePanel && (
        <AdminWorkspace
          panel={activePanel}
          onClose={() => setActivePanel(null)}
          onChangePanel={setActivePanel}
        />
      )}
    </div>
  );
}
