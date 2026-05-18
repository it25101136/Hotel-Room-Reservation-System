import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

type Mode = "signin" | "register";

export default function AuthGate() {
  const { signIn, register } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await register(name, email, password);

    addToast(result.message, result.success ? "success" : "error");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-500 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(212,168,83,0.1),_transparent_30%)]" />

      <div className="relative min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left visual panel */}
        <div className="relative hidden lg:flex items-end overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(212,168,83,0.9) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />

          <div className="relative z-10 p-10 xl:p-14 max-w-2xl">
            <div className="inline-flex items-center gap-3 border border-gold-500/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.35em] text-gold-400 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              Private Guest Access
            </div>
            <h1 className="font-display text-5xl xl:text-7xl leading-none mt-6 text-white font-bold">
              Welcome to
              <span className="block gold-shimmer mt-2">Aurum</span>
            </h1>
            <p className="text-lg text-gray-300 mt-6 max-w-xl leading-relaxed">
              Sign in to unlock reservations, guest preferences, exclusive offers,
              private concierge access, and your personalised luxury experience.
              Admin credentials will open the executive statistics dashboard.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              {[
                "Book premium rooms instantly",
                "Access VIP-only offers",
                "Save guest preferences",
                "Admin dashboard for operations",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-black/25 border border-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/35 flex items-center justify-center text-gold-400 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right auth panel */}
        <div className="relative flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2 justify-center mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-gold-400 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-gold-400">A</span>
                </div>
                <span className="font-display text-3xl tracking-wider text-white">AURUM</span>
              </div>
              <p className="text-sm uppercase tracking-[0.25em] text-gold-400">Guest Access</p>
            </div>

            <div className="bg-dark-400/75 border border-gold-500/20 shadow-2xl shadow-black/50 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-sm">
              <div className="flex items-center justify-between gap-3 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-2">Aurum Hotel</p>
                  <h2 className="font-display text-3xl text-white font-bold">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Secure Access
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-black/25 border border-white/10 p-1 mb-8">
                <button
                  onClick={() => setMode("signin")}
                  className={`px-4 py-3 text-sm uppercase tracking-widest transition-all duration-300 ${
                    mode === "signin"
                      ? "bg-gold-500 text-black font-semibold"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={`px-4 py-3 text-sm uppercase tracking-widest transition-all duration-300 ${
                    mode === "register"
                      ? "bg-gold-500 text-black font-semibold"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Email Address</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="guest@aurumhotel.lk"
                    required
                    className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-dark-300 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 focus:shadow-lg focus:shadow-gold-500/10 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
                >
                  {loading
                    ? "Please wait..."
                    : mode === "signin"
                      ? "Enter Aurum"
                      : "Create Account"}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 text-center leading-relaxed">
                  Your access is protected by Aurum&apos;s secure guest authentication system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
