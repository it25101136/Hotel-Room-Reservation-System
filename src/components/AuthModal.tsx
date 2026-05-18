import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useToast } from "./Toast";

type Mode = "signin" | "register";

export default function AuthModal() {
  const { isOpen, reason, closeAuth, completeAuth } = useAuthModal();
  const { signIn, register } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeAuth]);

  useEffect(() => {
    if (isOpen) {
      setMode("signin");
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await register(name, email, password);

    // Handle "No account found" case by switching to Register
    if (result.type === "not_found") {
      addToast("No account found with that email.", "info");
      setMode("register");
      setLoading(false);
      return;
    }

    addToast(result.message, result.success ? "success" : "error");
    setLoading(false);

    if (result.success) {
      // Admin users should go directly to the dashboard and should NOT continue
      // the pending public-site action (booking, tour, etc.).
      if (result.role === "admin") {
        closeAuth();
        return;
      }

      // Guest / VIP users continue into the action they originally clicked.
      completeAuth();
    }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="relative w-full max-w-5xl bg-dark-500 border border-gold-500/20 shadow-2xl shadow-black/50 overflow-hidden">
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 z-10 w-11 h-11 border border-white/10 text-white hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 flex items-center justify-center"
          aria-label="Close sign in"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] min-h-[620px]">
          {/* Visual side */}
          <div className="relative hidden lg:flex items-end overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/45" />
            <div className="relative z-10 p-10 xl:p-12 max-w-xl">
              <div className="inline-flex items-center gap-2 border border-gold-500/30 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold-400 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                Secure Guest Access
              </div>
              <h2 className="font-display text-5xl text-white font-bold mt-6 leading-tight">
                Continue your
                <span className="block gold-shimmer mt-2">Aurum Journey</span>
              </h2>
              <p className="text-gray-300 mt-6 text-lg leading-relaxed">
                {reason}
              </p>
              <div className="grid gap-3 mt-8 text-sm text-gray-200">
                {[
                  "Reserve luxury rooms and suites",
                  "Manage bookings, offers, menus and spa requests",
                  "Unlock personalised guest preferences",
                  "Keep one elegant profile for all your stays",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-black/20 border border-white/10 px-4 py-3 backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/35 flex items-center justify-center text-gold-400 shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-xl">
              <div className="text-center mb-8 lg:hidden">
                <div className="inline-flex items-center gap-2 justify-center mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-400 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-gold-400">A</span>
                  </div>
                  <span className="font-display text-3xl tracking-wider text-white">AURUM</span>
                </div>
                <p className="text-sm uppercase tracking-[0.25em] text-gold-400">Sign in to continue</p>
              </div>

              <div className="mb-7">
                <p className="text-xs uppercase tracking-[0.25em] text-gold-400 mb-2">Aurum Hotel</p>
                <h3 className="font-display text-3xl text-white font-bold">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </h3>
                <p className="text-sm text-gray-400 mt-3 max-w-md">{reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-black/25 border border-white/10 p-1 mb-7">
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
                    placeholder="your@email.com"
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
                      ? "Continue to Aurum"
                      : "Create Account"}
                </button>
              </form>

              <div className="mt-7 pt-5 border-t border-white/10 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 leading-relaxed">
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
