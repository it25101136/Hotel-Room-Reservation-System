import { createContext, useContext, useState, useRef, type ReactNode } from "react";

interface AuthModalContextValue {
  isOpen: boolean;
  reason: string;
  openAuth: (reason?: string, onSuccess?: () => void) => void;
  closeAuth: () => void;
  completeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("Sign in to continue.");
  const pendingActionRef = useRef<(() => void) | null>(null);

  const openAuth = (message = "Sign in to continue.", onSuccess?: () => void) => {
    setReason(message);
    pendingActionRef.current = onSuccess ?? null;
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeAuth = () => {
    setIsOpen(false);
    pendingActionRef.current = null;
    document.body.style.overflow = "";
  };

  const completeAuth = () => {
    const action = pendingActionRef.current;
    setIsOpen(false);
    pendingActionRef.current = null;
    document.body.style.overflow = "";
    if (action) action();
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, reason, openAuth, closeAuth, completeAuth }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
