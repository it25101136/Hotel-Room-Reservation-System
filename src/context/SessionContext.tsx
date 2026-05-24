import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type ActivityType =
  | "login"
  | "logout"
  | "booking"
  | "view-tour"
  | "view-room"
  | "view-menu"
  | "spa-request"
  | "event-inquiry"
  | "review"
  | "payment"
  | "profile-update"
  | "page-visit";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
  meta?: Record<string, string | number>;
}

interface SessionContextValue {
  activities: Activity[];
  trackActivity: (type: ActivityType, title: string, description?: string, meta?: Activity["meta"]) => void;
  clearHistory: () => void;
  isSessionOpen: boolean;
  openSession: () => void;
  closeSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = "aurum-session-activities";
const MAX_ACTIVITIES = 100;

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSessionOpen, setIsSessionOpen] = useState(false);

  // Load activities for the current user
  useEffect(() => {
    if (!user) {
      setActivities([]);
      return;
    }
    const key = `${STORAGE_KEY}-${user.id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setActivities(JSON.parse(raw) as Activity[]);
      } catch {
        setActivities([]);
      }
    } else {
      // Seed with login activity if no history yet
      const seed: Activity = {
        id: `act-${Date.now()}`,
        type: "login",
        title: "Signed in to Aurum",
        description: `Welcome, ${user.name}! You signed in as ${user.role}.`,
        timestamp: Date.now(),
      };
      setActivities([seed]);
      localStorage.setItem(key, JSON.stringify([seed]));
    }
  }, [user]);

  const trackActivity = (
    type: ActivityType,
    title: string,
    description = "",
    meta?: Activity["meta"]
  ) => {
    if (!user) return;
    const activity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      title,
      description,
      timestamp: Date.now(),
      meta,
    };
    setActivities((prev) => {
      const next = [activity, ...prev].slice(0, MAX_ACTIVITIES);
      const key = `${STORAGE_KEY}-${user.id}`;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    if (!user) return;
    const key = `${STORAGE_KEY}-${user.id}`;
    localStorage.removeItem(key);
    setActivities([]);
  };

  const openSession = () => {
    setIsSessionOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSession = () => {
    setIsSessionOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <SessionContext.Provider
      value={{
        activities,
        trackActivity,
        clearHistory,
        isSessionOpen,
        openSession,
        closeSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
