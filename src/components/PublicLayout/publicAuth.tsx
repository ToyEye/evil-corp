import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthModal } from "../Modals/AuthModal";

export type AuthTab = "signin" | "request";

type PublicAuthContextValue = {
  openAuth: (tab?: AuthTab) => void;
};

const PublicAuthContext = createContext<PublicAuthContextValue | null>(null);

export const usePublicAuth = () => {
  const context = useContext(PublicAuthContext);

  if (!context) {
    throw new Error("usePublicAuth must be used within PublicAuthProvider");
  }

  return context;
};

export const PublicAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("signin");

  const openAuth = useCallback((nextTab: AuthTab = "signin") => {
    setTab(nextTab);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ openAuth }), [openAuth]);

  return (
    <PublicAuthContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTab={tab === "request" ? 1 : 0}
      />
    </PublicAuthContext.Provider>
  );
};
