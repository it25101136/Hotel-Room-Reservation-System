import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

/**
 * Visible session bar for Guest / VIP users.
 * Gives them a clear logout option after signing in.
 */
export default function UserSessionBar() {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  // Only show for signed-in guest / VIP users.
  if (!user || user.role === "admin") return null;

  const handleLogout = () => {
    addToast("You have been logged out successfully.", "info");
    signOut();
  };

  return (
    <div className="fixed top-20 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="bg-black/70 backdrop-blur-xl border border-gold-500/20 shadow-xl shadow-black/30 px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gold-500 text-black flex items-center justify-center font-display font-bold text-lg shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.25em] text-gold-400">
                Signed in as {user.role}
              </div>
              <div className="text-white font-medium truncate">{user.name}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => addToast("Your account preferences are saved for this session.", "info")}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white uppercase tracking-widest text-xs font-semibold transition-all duration-300"
            >
              My Session
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-black uppercase tracking-widest text-xs font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
