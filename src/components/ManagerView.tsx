import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import AdminWorkspace, { type AdminPanelKey } from "./AdminWorkspace";

interface ManagerViewProps {
  panel: AdminPanelKey;
  title: string;
}

export default function ManagerView({ panel, title }: ManagerViewProps) {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  // Managers cannot switch to other panels — the panel they get is fixed.
  const [currentPanel] = useState<AdminPanelKey>(panel);

  const handleSignOut = () => {
    addToast(`${title} signed out successfully.`, "info");
    signOut();
  };

  return (
    <div className="min-h-screen bg-dark-500 text-white">
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
                <div className="text-xs uppercase tracking-[0.28em] text-gold-400">{title}</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.22em] text-gold-400">Logged in as</div>
                <div className="text-sm font-medium">{user?.name ?? "Manager"}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-5 py-3 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-black font-semibold uppercase tracking-widest text-xs transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Manager intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
          <div className="bg-gradient-to-br from-dark-300 to-dark-400 border border-gold-500/20 p-8 shadow-2xl shadow-black/30">
            <div className="inline-flex items-center gap-2 border border-gold-500/20 bg-gold-500/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-gold-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Manager Access · {title}
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-white font-bold mt-5 leading-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-400 mt-3 max-w-2xl">
              You have direct access to manage your assigned section. Use the tools below
              to add, edit, delete, and review activity in your domain.
            </p>
          </div>
        </section>

        {/* The panel itself — rendered inline (not as a popup) */}
        <div className="pb-12 -mt-4">
          <AdminWorkspace
            panel={currentPanel}
            onClose={() => {}}
            onChangePanel={() => {}}
            allowedPanels={[currentPanel]}
            hideClose
          />
        </div>
      </div>
    </div>
  );
}
