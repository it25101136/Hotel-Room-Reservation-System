import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthRole =
  | "guest"
  | "vip"
  | "admin"
  | "rooms-manager"
  | "reservations-manager"
  | "customers-manager"
  | "payments-manager"
  | "reviews-manager"
  | "services-manager";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  role?: AuthUser["role"];
  type?: "not_found" | "wrong_password" | "success" | "error";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_USER_KEY = "aurum-auth-user";
const AUTH_USERS_KEY = "aurum-auth-users";

const demoUsers: StoredUser[] = [
  {
    id: "1",
    name: "Aurum Guest",
    email: "guest@aurumhotel.lk",
    password: "guest123",
    role: "guest",
  },
  {
    id: "2",
    name: "Aurum VIP",
    email: "vip@aurumhotel.lk",
    password: "vip123",
    role: "vip",
  },
  {
    id: "3",
    name: "Aurum Admin",
    email: "admin@aurumhotel.lk",
    password: "admin123",
    role: "admin",
  },
  // Member-specific manager accounts — each can only see their own panel
  {
    id: "10",
    name: "Rooms Manager",
    email: "room@auramhotel.lk",
    password: "room123",
    role: "rooms-manager",
  },
  {
    id: "11",
    name: "Reservations Manager",
    email: "reservation@auramhotel.lk",
    password: "Reservation123",
    role: "reservations-manager",
  },
  {
    id: "12",
    name: "Customers Manager",
    email: "customer@auramhotel.lk",
    password: "Customer123",
    role: "customers-manager",
  },
  {
    id: "13",
    name: "Payments Manager",
    email: "payment@auramhotel.lk",
    password: "Payment123",
    role: "payments-manager",
  },
  {
    id: "14",
    name: "Reviews Manager",
    email: "reviews@auramhotel.lk",
    password: "Reviews123",
    role: "reviews-manager",
  },
  {
    id: "15",
    name: "Services Manager",
    email: "facilities@auramhotel.lk",
    password: "Facilities123",
    role: "services-manager",
  },
];

import { apiClient } from "../utils/apiClient";

function getStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(AUTH_USERS_KEY);
  if (!raw) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  }
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) {
        try {
          setUser(JSON.parse(raw) as AuthUser);
        } catch {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }

      // Fetch users from persistent text files
      const db = await apiClient.loadDb();
      if (db && db.authUsers) {
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(db.authUsers));
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!emailExists) {
        return { success: false, message: "No account found. Please register.", type: "not_found" as const };
      }
      return { success: false, message: "Incorrect password.", type: "wrong_password" as const };
    }

    const safeUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true, message: `Welcome back, ${safeUser.name}!`, role: safeUser.role, type: "success" as const };
  };

  const register = async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "guest",
    };

    const nextUsers = [...users, newUser];
    
    // Sync with backend text files database (admins.txt/customers.txt)
    await apiClient.syncCollection("authUsers", nextUsers);

    // Also register customer record in customers.txt database
    const rawCustomers = localStorage.getItem("aurum-customers");
    let currentCustomers = [];
    if (rawCustomers) {
      try { currentCustomers = JSON.parse(rawCustomers); } catch {}
    }
    const newCustomer = {
      id: `C-${Date.now().toString().slice(-3)}`,
      name,
      tier: "Guest" as const,
      email,
      stays: 0
    };
    const nextCustomers = [...currentCustomers, newCustomer];
    await apiClient.syncCollection("customers", nextCustomers);

    const safeUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true, message: `Welcome to Aurum, ${safeUser.name}!`, role: safeUser.role, type: "success" as const };
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signIn, register, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
