import { useEffect } from "react";

export interface AnalyticsStat {
  label: string;
  value: string;
  trend?: string;
  tone?: "gold" | "green" | "red" | "blue" | "amber";
}

export interface AnalyticsBreakdown {
  label: string;
  value: number;
  total: number;
  tone?: "gold" | "green" | "red" | "blue" | "amber";
}

export interface AnalyticsInsight {
  icon: string;
  title: string;
  detail: string;
}

export interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  panelLabel: string;
  stats: AnalyticsStat[];
  breakdowns: AnalyticsBreakdown[];
  insights: AnalyticsInsight[];
  timeline?: { label: string; value: number }[];
}

const toneClasses: Record<string, string> = {
  gold: "text-gold-400 bg-gold-500/10 border-gold-500/30",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  red: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  blue: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
};

const fillClasses: Record<string, string> = {
  gold: "bg-gradient-to-r from-gold-600 to-gold-400",
  green: "bg-gradient-to-r from-emerald-600 to-emerald-400",
  red: "bg-gradient-to-r from-rose-600 to-rose-400",
  blue: "bg-gradient-to-r from-sky-600 to-sky-400",
  amber: "bg-gradient-to-r from-amber-600 to-amber-400",
};

export default function AnalyticsModal({
  open,
  onClose,
  title,
  panelLabel,
  stats,
  breakdowns,
  insights,
  timeline,
}: AnalyticsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxTimeline = timeline?.length
    ? Math.max(...timeline.map((t) => t.value), 1)
    : 1;

  return (
    <div
      className="fixed inset-0 z-[280] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-dark-500 border border-gold-500/30 shadow-2xl shadow-black/60 my-8 animate-[scaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 text-gray-400 hover:text-gold-400 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-5 border-b border-white/5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-gold-400 mb-3">{panelLabel}</div>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-display text-3xl text-white font-bold">{title}</h2>
              <div className="w-12 h-[2px] bg-gold-500 mt-3" />
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              Live snapshot · {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`border p-4 ${toneClasses[stat.tone ?? "gold"]}`}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-gray-400 mb-2">
                {stat.label}
              </div>
              <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
              {stat.trend && (
                <div className="text-xs mt-2 opacity-80">{stat.trend}</div>
              )}
            </div>
          ))}
        </div>

        {/* Breakdown bar chart */}
        {breakdowns.length > 0 && (
          <div className="px-6 pb-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-4">
              Distribution Breakdown
            </div>
            <div className="bg-dark-400 border border-white/5 p-5 space-y-4">
              {breakdowns.map((item) => {
                const percent = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <span className="text-sm text-white font-semibold">
                        {item.value} <span className="text-gray-500 text-xs">({percent}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 overflow-hidden">
                      <div
                        className={`h-full ${fillClasses[item.tone ?? "gold"]} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline chart */}
        {timeline && timeline.length > 0 && (
          <div className="px-6 pb-6">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-4">
              7-Day Activity Trend
            </div>
            <div className="bg-dark-400 border border-white/5 p-5">
              <div className="flex items-end justify-between gap-2 h-32">
                {timeline.map((point, idx) => {
                  const height = (point.value / maxTimeline) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-gold-400 font-semibold">
                        {point.value}
                      </div>
                      <div className="w-full bg-white/5 flex-1 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-gold-600 to-gold-400 transition-all duration-500"
                          style={{ height: `${height}%`, minHeight: point.value > 0 ? "4px" : "0" }}
                        />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-500">
                        {point.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="px-6 pb-8">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-400 mb-4">
              Smart Insights
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-dark-400 border border-white/10 p-4 flex items-start gap-3 hover:border-gold-500/30 transition-colors"
                >
                  <div className="text-2xl shrink-0">{insight.icon}</div>
                  <div>
                    <div className="text-white text-sm font-semibold mb-1">{insight.title}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{insight.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/5 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-black/30">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
            Auto-refreshed from panel data
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
