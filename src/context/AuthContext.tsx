import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "guest" | "vip" | "admin";
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
];

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
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setLoading(false);
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
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(nextUsers));

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
