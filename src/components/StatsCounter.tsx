import { useEffect, useState, useRef } from "react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
}

const stats: Stat[] = [
  { label: "Guests Served", value: 25000, suffix: "+" },
  { label: "Luxury Rooms", value: 128, suffix: "" },
  { label: "Awards Won", value: 45, suffix: "+" },
  { label: "Years of Excellence", value: 25, suffix: "" },
];

function StatItem({ stat }: { stat: Stat }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = stat.value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
              setCount(stat.value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="relative inline-block">
        <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-gold-400">
          {count.toLocaleString()}
          <span className="text-gold-400">{stat.suffix}</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gold-400/50 transition-all duration-500 group-hover:w-full" />
      </div>
      <div className="text-gray-400 uppercase tracking-widest text-xs mt-4">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Dark marble background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-400 via-dark-300 to-dark-400" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
