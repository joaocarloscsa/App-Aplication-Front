// /var/www/GSA/animal/frontend/src/components/MeContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchMe, MeResponse } from "@/services/me";
import { clearAccessToken } from "@/stores/auth";

type MeContextValue = {
  me: MeResponse | null;
  loading: boolean;
  reloadMe: () => Promise<void>;
  resetMe: () => void;
};

const MeContext = createContext<MeContextValue | undefined>(undefined);

export function MeProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    setLoading(true);
    try {
      const data = await fetchMe();
      setMe(data);
    } catch {
      setMe(null);
      clearAccessToken();
    } finally {
      setLoading(false);
    }
  }

  function resetMe() {
    setMe(null);
    setLoading(false);
  }

  useEffect(() => {
    loadMe();
  }, []);

  return (
    <MeContext.Provider
      value={{
        me,
        loading,
        reloadMe: loadMe,
        resetMe,
      }}
    >
      {children}
    </MeContext.Provider>
  );
}

export function useMe(): MeContextValue {
  const ctx = useContext(MeContext);
  if (!ctx) {
    throw new Error("useMe must be used inside MeProvider");
  }
  return ctx;
}

