import { useEffect, useMemo, useState } from "react";
import { useToast } from "./Toast";
import { useVirtualTour } from "../context/VirtualTourContext";

type Hotspot = {
  id: string;
  label: string;
  x: string;
  y: string;
  description: string;
};

type Scene = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  category: string;
  description: string;
  highlights: string[];
  hotspots: Hotspot[];
};

const scenes: Scene[] = [
  {
    id: "lobby",
    name: "Grand Lobby",
    subtitle: "An arrival bathed in gold and marble",
    image: "/images/hero-bg.jpg",
    category: "Arrival",
    description:
      "Step into Aurum's signature lobby where crystal chandeliers, polished marble, and quiet butler service create a breathtaking first impression.",
    highlights: ["24/7 concierge", "Champagne welcome", "Marble atrium", "Live evening piano"],
    hotspots: [
      { id: "desk", label: "Concierge Desk", x: "52%", y: "58%", description: "Dedicated luxury concierge available around the clock." },
      { id: "chandelier", label: "Grand Chandelier", x: "50%", y: "20%", description: "A handcrafted centrepiece inspired by timeless European palaces." },
      { id: "lounge", label: "Lobby Lounge", x: "18%", y: "70%", description: "Relax with signature tea service and light canapés." },
    ],
  },
  {
    id: "suite",
    name: "Executive Suite",
    subtitle: "Expansive comfort with skyline elegance",
    image: "/images/executive-suite.jpg",
    category: "Suites",
    description:
      "A sanctuary of calm with a private living space, artisan details, premium linens, and panoramic city views for work or leisure.",
    highlights: ["Separate lounge", "Butler service", "Premium bath", "Evening turndown"],
    hotspots: [
      { id: "bed", label: "King Bed", x: "48%", y: "60%", description: "Tailored bedding with premium Egyptian cotton and pillow menu." },
      { id: "window", label: "Skyline View", x: "80%", y: "45%", description: "Floor-to-ceiling windows framing Colombo's coastal skyline." },
      { id: "lounge", label: "Living Area", x: "20%", y: "65%", description: "Ideal for private meetings or elegant in-room dining." },
    ],
  },
  {
    id: "dining",
    name: "Signature Restaurant",
    subtitle: "Michelin-inspired dining artistry",
    image: "/images/dining.jpg",
    category: "Dining",
    description:
      "Discover seasonal tasting menus, candlelit service, and a wine cellar curated for unforgettable pairings.",
    highlights: ["Chef's tasting menu", "Private dining", "2K+ wine labels", "Ocean-inspired cuisine"],
    hotspots: [
      { id: "table", label: "Chef's Table", x: "44%", y: "62%", description: "An intimate front-row culinary experience." },
      { id: "wine", label: "Wine Pairing", x: "72%", y: "48%", description: "Rare vintages selected by our resident sommelier." },
      { id: "terrace", label: "Romantic Seating", x: "20%", y: "50%", description: "Reserved corners designed for private dinners." },
    ],
  },
  {
    id: "spa",
    name: "Spa Sanctuary",
    subtitle: "Wellness, quietude, renewal",
    image: "/images/spa.jpg",
    category: "Wellness",
    description:
      "A serene, candlelit haven where therapies blend modern technique with ancient ritual for a restorative escape.",
    highlights: ["Gold facial rituals", "Aromatherapy", "Couples suite", "Steam & recovery"],
    hotspots: [
      { id: "treatment", label: "Treatment Bed", x: "50%", y: "65%", description: "Prepared for bespoke therapies by our master therapists." },
      { id: "candles", label: "Ambient Ritual", x: "24%", y: "42%", description: "Low-lit calm and aromatic oils to ease body and mind." },
      { id: "products", label: "Wellness Essentials", x: "76%", y: "44%", description: "Signature oils and botanical products selected for your session." },
    ],
  },
  {
    id: "pool",
    name: "Infinity Pool",
    subtitle: "Sunset, skyline, serenity",
    image: "/images/pool.jpg",
    category: "Leisure",
    description:
      "An elevated pool deck with panoramic views, private loungers, and uninterrupted sunset moments above the city.",
    highlights: ["Sunset deck", "Poolside dining", "Private cabanas", "Heated water"],
    hotspots: [
      { id: "deck", label: "Sky Deck", x: "55%", y: "72%", description: "A front-row seat to golden-hour views over Colombo." },
      { id: "cabanas", label: "Private Cabanas", x: "24%", y: "56%", description: "Personalized service and shaded luxury for all-day comfort." },
      { id: "bar", label: "Pool Bar", x: "78%", y: "52%", description: "Signature cocktails and fresh small plates delivered to your lounger." },
    ],
  },
  {
    id: "bar",
    name: "Rooftop Lounge",
    subtitle: "Golden nights above the city",
    image: "/images/gallery-2.jpg",
    category: "Nightlife",
    description:
      "Aurum's rooftop comes alive after dark with crafted cocktails, skyline ambience, and sophisticated after-hours energy.",
    highlights: ["Skyline cocktails", "Live DJ nights", "Private events", "Sunset pairings"],
    hotspots: [
      { id: "cocktail", label: "Signature Cocktails", x: "36%", y: "58%", description: "Seasonal creations inspired by tropical Sri Lankan notes." },
      { id: "view", label: "Skyline Vista", x: "70%", y: "30%", description: "A cinematic urban view stretching across the coast." },
      { id: "vip", label: "VIP Booths", x: "18%", y: "64%", description: "Reserved lounge seating for elevated evenings and celebrations." },
    ],
  },
];

export default function VirtualTour() {
  const { isOpen, closeTour, initialSceneId } = useVirtualTour();
  const { addToast } = useToast();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [autoPan, setAutoPan] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const startIndex = initialSceneId
      ? Math.max(0, scenes.findIndex((s) => s.id === initialSceneId))
      : 0;
    setSceneIndex(startIndex);
    setActiveHotspotId(null);
    setAutoPan(true);
  }, [isOpen, initialSceneId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeTour();
      if (e.key === "ArrowRight") nextScene();
      if (e.key === "ArrowLeft") prevScene();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const scene = scenes[sceneIndex];
  const activeHotspot = useMemo(
    () => scene.hotspots.find((h) => h.id === activeHotspotId) ?? scene.hotspots[0],
    [scene, activeHotspotId]
  );

  const nextScene = () => {
    setSceneIndex((i) => (i + 1) % scenes.length);
    setActiveHotspotId(null);
  };

  const prevScene = () => {
    setSceneIndex((i) => (i - 1 + scenes.length) % scenes.length);
    setActiveHotspotId(null);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        addToast("Entering fullscreen tour", "info");
      } else {
        await document.exitFullscreen();
        addToast("Exiting fullscreen tour", "info");
      }
    } catch {
      addToast("Fullscreen mode is not available on this browser", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[220] bg-black/95 backdrop-blur-md animate-[fadeIn_0.25s_ease-out]">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/85 to-transparent p-4 sm:p-6">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-gold-400">
                360° Virtual Tour
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white font-bold">
                {scene.name}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl">
                {scene.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setAutoPan((v) => !v)}
                className={`px-4 py-3 text-xs sm:text-sm uppercase tracking-widest border transition-all duration-300 ${
                  autoPan
                    ? "bg-gold-500 text-black border-gold-500"
                    : "bg-black/40 text-gold-400 border-gold-500/30 hover:bg-gold-500/10"
                }`}
              >
                {autoPan ? "Auto Pan On" : "Auto Pan Off"}
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-3 text-xs sm:text-sm uppercase tracking-widest border border-gold-500/30 bg-black/40 text-gold-400 hover:bg-gold-500/10 transition-all duration-300"
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              <button
                onClick={closeTour}
                className="w-12 h-12 border border-white/15 bg-black/40 text-white hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 flex items-center justify-center"
                aria-label="Close virtual tour"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main stage */}
        <div className="relative h-full w-full grid lg:grid-cols-[1fr_360px]">
          {/* Scene viewport */}
          <div className="relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-cover bg-center scale-110 ${autoPan ? "virtual-tour-pan" : ""}`}
              style={{ backgroundImage: `url(${scene.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

            {/* subtle grid for cinematic feel */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                 style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

            {/* Scene navigation arrows */}
            <button
              onClick={prevScene}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gold-500/30 bg-black/40 text-gold-400 hover:bg-gold-500 hover:text-black transition-all duration-300 flex items-center justify-center"
              aria-label="Previous scene"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={nextScene}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gold-500/30 bg-black/40 text-gold-400 hover:bg-gold-500 hover:text-black transition-all duration-300 flex items-center justify-center"
              aria-label="Next scene"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Hotspots */}
            {scene.hotspots.map((spot) => {
              const active = spot.id === (activeHotspot?.id ?? scene.hotspots[0]?.id);
              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    setActiveHotspotId(spot.id);
                    addToast(`${spot.label} selected`, "info");
                  }}
                  className="absolute z-10 group"
                  style={{ left: spot.x, top: spot.y, transform: "translate(-50%, -50%)" }}
                  aria-label={spot.label}
                >
                  <span className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                    active
                      ? "bg-gold-500 text-black border-gold-500 shadow-[0_0_30px_rgba(212,168,83,0.6)]"
                      : "bg-black/50 text-gold-400 border-gold-500/50 group-hover:bg-gold-500/20"
                  }`}>
                    <span className="absolute inset-0 rounded-full virtual-tour-pulse" />
                    <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-black/70 border border-gold-500/20 text-[10px] uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {spot.label}
                  </span>
                </button>
              );
            })}

            {/* Bottom scene pills */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-2 px-4">
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSceneIndex(i);
                    setActiveHotspotId(null);
                  }}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.25em] border transition-all duration-300 ${
                    i === sceneIndex
                      ? "bg-gold-500 text-black border-gold-500"
                      : "bg-black/40 text-gold-400 border-gold-500/20 hover:bg-gold-500/10"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="relative z-10 hidden lg:flex flex-col bg-dark-400/90 backdrop-blur-xl border-l border-gold-500/20">
            <div className="p-6 border-b border-white/5">
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-2">{scene.category}</div>
              <h3 className="font-display text-2xl text-white font-bold">{scene.name}</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{scene.description}</p>
            </div>

            <div className="p-6 border-b border-white/5">
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-3">Focused Detail</div>
              <div className="bg-black/30 border border-gold-500/10 p-4 rounded-sm">
                <div className="font-semibold text-white mb-1">{activeHotspot?.label}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{activeHotspot?.description}</div>
              </div>
            </div>

            <div className="p-6 border-b border-white/5">
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-3">Highlights</div>
              <div className="flex flex-wrap gap-2">
                {scene.highlights.map((h) => (
                  <span key={h} className="text-xs px-3 py-2 border border-white/10 bg-white/5 text-gray-300 rounded-sm">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-3">Tour Stops</div>
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSceneIndex(i);
                    setActiveHotspotId(null);
                  }}
                  className={`w-full text-left p-3 rounded-sm border transition-all duration-300 ${
                    i === sceneIndex
                      ? "border-gold-500 bg-gold-500/10"
                      : "border-white/5 hover:border-gold-500/30 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-16 h-12 bg-cover bg-center rounded-sm shrink-0"
                      style={{ backgroundImage: `url(${s.image})` }}
                    />
                    <div>
                      <div className="text-white font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">{s.category}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
