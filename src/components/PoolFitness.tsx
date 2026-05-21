import { useEffect, useRef, useState } from "react";

const amenities = [
  {
    title: "Infinity Pool",
    image: "/images/pool.jpg",
    description: "Our stunning rooftop infinity pool offers breathtaking views of the city skyline. Relax on elegant loungers or enjoy a refreshing dip in the heated waters.",
    features: ["Heated year-round", "Panoramic views", "Poolside service", "Sunset loungers"],
  },
  {
    title: "Fitness Center",
    image: "/images/gym.jpg",
    description: "State-of-the-art fitness center equipped with the latest Technogym equipment, personal trainers, and dedicated yoga and Pilates studios.",
    features: ["Personal training", "Yoga studio", "Cardio & weights", "Steam room"],
  },
];

export default function PoolFitness() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-dark-400 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Gold accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm uppercase tracking-[0.3em] font-medium">
            Leisure
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-4 mb-4">
            Pool & Fitness
          </h2>
          <div className="w-16 h-[2px] bg-gold-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {amenities.map((item, index) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Title on image */}
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-2xl md:text-3xl text-white font-bold">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 border-t-0 p-6">
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs text-gray-400 border border-white/10 px-3 py-1.5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
