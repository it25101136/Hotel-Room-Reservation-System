import { useEffect, useMemo, useState } from "react";
import { useToast } from "./Toast";

export interface RevenueChannel {
  name: string;
  percent: number;
  amount: string;
}

interface RevenueInsightsModalProps {
  open: boolean;
  onClose: () => void;
  channels: RevenueChannel[];
}

const TONES = ["gold", "blue", "green", "amber", "violet"] as const;

const toneStyles: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  gold:   { bg: "bg-gold-500/10",    text: "text-gold-400",    border: "border-gold-500/30",    gradient: "from-gold-600 to-gold-400" },
  blue:   { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/30",     gradient: "from-sky-600 to-sky-400" },
  green:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", gradient: "from-emerald-600 to-emerald-400" },
  amber:  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",   gradient: "from-amber-600 to-amber-400" },
  violet: { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/30",  gradient: "from-violet-600 to-violet-400" },
};

function parseAmount(text: string): number {
  // "LKR 10.7M" → 10700000
  const num = parseFloat(text.replace(/[^0-9.]/g, ""));
  if (text.toUpperCase().includes("M")) return num * 1_000_000;
  if (text.toUpperCase().includes("K")) return num * 1_000;
  return num;
}

function formatLKR(n: number): string {
  if (n >= 1_000_000) return `LKR ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `LKR ${(n / 1_000).toFixed(1)}K`;
  return `LKR ${n.toLocaleString()}`;
}

export default function RevenueInsightsModal({
  open,
  onClose,
  channels,
}: RevenueInsightsModalProps) {
  const { addToast } = useToast();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const analytics = useMemo(() => {
    const enriched = channels.map((c, i) => ({
      ...c,
      tone: TONES[i % TONES.length],
      amountNumeric: parseAmount(c.amount),
    }));

    const total = enriched.reduce((sum, c) => sum + c.amountNumeric, 0);
    const top = [...enriched].sort((a, b) => b.amountNumeric - a.amountNumeric)[0];
    const lowest = [...enriched].sort((a, b) => a.amountNumeric - b.amountNumeric)[0];

    // Time range multipliers (for projections)
    const multipliers = {
      week: 0.25,
      month: 1,
      quarter: 3,
      year: 12,
    };
    const mult = multipliers[timeRange];

    return {
      enriched,
      total,
      top,
      lowest,
      projected: total * mult * 1.05, // 5% growth
      avgPerChannel: total / enriched.length,
      diversification: 100 - (top.amountNumeric / total) * 100, // 0 = all in one, 100 = perfectly diversified
    };
  }, [channels, timeRange]);

  if (!open) return null;

  const handleExport = () => {
    const csv = [
      ["Department", "Revenue (LKR)", "Contribution (%)"].join(","),
      ...analytics.enriched.map((c) =>
        [c.name, c.amountNumeric, c.percent].join(",")
      ),
      [],
      ["Total Revenue", analytics.total],
      ["Projected", Math.round(analytics.projected)],
      ["Time Range", timeRange],
    ]
      .map((row) => (Array.isArray(row) ? row.join(",") : row))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aurum-revenue-insights-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("Revenue report exported as CSV", "success");
  };

  const handleShare = () => {
    addToast("Insights report shared with management team", "success");
  };

  return (
    <div
      className="fixed inset-0 z-[280] bg-black/85 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6 animate-[fadeIn_0.25s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative my-4 w-full max-w-6xl bg-dark-500 border border-gold-500/30 shadow-2xl shadow-black/60 animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 border border-white/10 bg-black/40 text-white hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 flex items-center justify-center"
          aria-label="Close"
          title="Close (Esc)"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-5 border-b border-white/10 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold-400 mb-3">
            Revenue Composition · Aurum Hotel
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl text-white font-bold">
                Department Insights
              </h2>
              <p className="text-gray-400 mt-2 text-sm max-w-2xl">
                Deep dive into how each Aurum department contributes to total revenue,
                with smart projections and growth opportunities.
              </p>
            </div>

            {/* Time range selector */}
            <div className="flex gap-2 bg-black/40 border border-white/10 p-1">
              {(["week", "month", "quarter", "year"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    timeRange === range
                      ? "bg-gold-500 text-black font-semibold"
                      : "text-gray-400 hover:text-gold-400"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-6 border-b border-white/5">
          <div className="bg-dark-300 border border-gold-500/30 p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold-400 mb-2">
              Total Revenue
            </div>
            <div className="font-display text-3xl text-white font-bold">
              {formatLKR(analytics.total)}
            </div>
            <div className="text-xs text-emerald-400 mt-2">↑ Current period</div>
          </div>

          <div className="bg-dark-300 border border-emerald-500/30 p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-400 mb-2">
              Projected ({timeRange})
            </div>
            <div className="font-display text-3xl text-white font-bold">
              {formatLKR(analytics.projected)}
            </div>
            <div className="text-xs text-emerald-400 mt-2">↑ +5% growth target</div>
          </div>

          <div className="bg-dark-300 border border-sky-500/30 p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-sky-400 mb-2">
              Top Channel
            </div>
            <div className="font-display text-xl text-white font-bold">
              {analytics.top.name}
            </div>
            <div className="text-xs text-gold-400 mt-2">{analytics.top.percent}% of total</div>
          </div>

          <div className="bg-dark-300 border border-violet-500/30 p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-violet-400 mb-2">
              Diversification
            </div>
            <div className="font-display text-3xl text-white font-bold">
              {Math.round(analytics.diversification)}%
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {analytics.diversification > 60
                ? "Well balanced"
                : analytics.diversification > 30
                ? "Moderate spread"
                : "Top-heavy"}
            </div>
          </div>
        </div>

        {/* Visual donut representation + channels list */}
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 p-6 border-b border-white/5">
          {/* "Donut" stack */}
          <div className="bg-dark-300 border border-white/10 p-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-4">
              Revenue Share
            </div>
            <div className="relative w-44 h-44 mx-auto">
              {/* SVG donut */}
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let cumulative = 0;
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius;
                  return analytics.enriched.map((c) => {
                    const dashLength = (c.percent / 100) * circumference;
                    const offset = -cumulative;
                    cumulative += dashLength;
                    const stroke = {
                      gold: "#D4A853",
                      blue: "#38bdf8",
                      green: "#34d399",
                      amber: "#fbbf24",
                      violet: "#a78bfa",
                    }[c.tone];
                    return (
                      <circle
                        key={c.name}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={stroke}
                        strokeWidth="12"
                        strokeDasharray={`${dashLength} ${circumference}`}
                        strokeDashoffset={offset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Total
                </div>
                <div className="font-display text-xl text-white font-bold">
                  {formatLKR(analytics.total)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              {analytics.enriched.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-3 h-3 ${toneStyles[c.tone].bg} border ${toneStyles[c.tone].border}`}
                  />
                  <span className="text-gray-400 truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed channel performance */}
          <div className="bg-dark-300 border border-white/10 p-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-4">
              Channel Performance
            </div>
            <div className="space-y-4">
              {analytics.enriched.map((c) => {
                const tone = toneStyles[c.tone];
                const isTop = c.name === analytics.top.name;
                return (
                  <div key={c.name}>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{c.name}</span>
                        {isTop && (
                          <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-gold-500/20 text-gold-400 border border-gold-500/30">
                            Top
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`font-semibold ${tone.text}`}>{c.amount}</span>
                        <span className="text-xs text-gray-500">{c.percent}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-black/40 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${tone.gradient} transition-all duration-700`}
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">
                      {timeRange === "month" ? "This month" : `Projected for ${timeRange}: ${formatLKR(c.amountNumeric * { week: 0.25, month: 1, quarter: 3, year: 12 }[timeRange])}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Smart insights + recommendations */}
        <div className="p-6 border-b border-white/5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-4">
            Smart Recommendations
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <InsightCard
              icon="🏆"
              title="Leader Drives Most Revenue"
              detail={`${analytics.top.name} brings ${formatLKR(analytics.top.amountNumeric)} (${analytics.top.percent}%). Double down on premium services here.`}
            />
            <InsightCard
              icon="⚠️"
              title="Growth Opportunity"
              detail={`${analytics.lowest.name} only contributes ${analytics.lowest.percent}%. Launch a targeted campaign to boost performance.`}
            />
            <InsightCard
              icon="📊"
              title="Diversification Score"
              detail={`Your ${Math.round(analytics.diversification)}% diversification ${analytics.diversification > 50 ? "protects revenue from single-channel shocks" : "is risky — consider growing secondary channels"}.`}
            />
            <InsightCard
              icon="🎯"
              title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Projection`}
              detail={`At current pace + 5% growth, expect ${formatLKR(analytics.projected)} over the ${timeRange}. Set a stretch target of ${formatLKR(analytics.projected * 1.1)}.`}
            />
            <InsightCard
              icon="💡"
              title="Average per Channel"
              detail={`Each department averages ${formatLKR(analytics.avgPerChannel)}. Channels below this need attention or repositioning.`}
            />
            <InsightCard
              icon="📈"
              title="Action Priority"
              detail={`Focus next quarter on growing ${analytics.lowest.name} by 30% and protecting ${analytics.top.name}'s leading position.`}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 bg-black/30">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
            Generated · {new Date().toLocaleDateString("en-LK", { dateStyle: "medium" })}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white text-[11px] uppercase tracking-widest transition-all duration-300"
            >
              Share with Team
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 text-[11px] uppercase tracking-widest transition-all duration-300"
            >
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-black text-[11px] uppercase tracking-widest font-semibold transition-all duration-300"
            >
              Close Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return (
    <div className="bg-dark-300 border border-white/10 p-4 hover:border-gold-500/30 transition-colors flex items-start gap-3">
      <div className="text-2xl shrink-0">{icon}</div>
      <div>
        <div className="text-white text-sm font-semibold mb-1">{title}</div>
        <div className="text-xs text-gray-400 leading-relaxed">{detail}</div>
      </div>
    </div>
  );
}
