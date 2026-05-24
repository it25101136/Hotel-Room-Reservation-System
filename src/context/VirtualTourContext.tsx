import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";
import { useSession } from "./SessionContext";

interface VirtualTourContextValue {
  isOpen: boolean;
  openTour: (sceneId?: string) => void;
  closeTour: () => void;
  initialSceneId?: string;
}

const VirtualTourContext = createContext<VirtualTourContextValue | null>(null);

export function VirtualTourProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialSceneId, setInitialSceneId] = useState<string | undefined>();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { trackActivity } = useSession();

  const showTour = (sceneId?: string) => {
    setInitialSceneId(sceneId);
    setIsOpen(true);
    document.body.style.overflow = "hidden";

    trackActivity(
      "view-tour",
      "Started Virtual Tour",
      sceneId
        ? `Started the immersive 360° tour at the ${sceneId} scene.`
        : "Started the immersive 360° tour of Aurum Hotel.",
      sceneId ? { scene: sceneId } : undefined
    );
  };

  const openTour = (sceneId?: string) => {
    if (!user) {
      openAuth("Sign in to access Aurum's immersive 360° virtual tour.", () => {
        showTour(sceneId);
      });
      return;
    }
    showTour(sceneId);
  };

  const closeTour = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <VirtualTourContext.Provider value={{ isOpen, openTour, closeTour, initialSceneId }}>
      {children}
    </VirtualTourContext.Provider>
  );
}

export function useVirtualTour() {
  const ctx = useContext(VirtualTourContext);
  if (!ctx) throw new Error("useVirtualTour must be used within VirtualTourProvider");
  return ctx;
}
