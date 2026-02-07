// /var/www/GSA/animal/frontend/src/components/dashboard/DashboardOverlayContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type OverlayType = "storage" | "alerts" | "user" | "animals" | null;


type DashboardOverlayContextValue = {
  activeOverlay: OverlayType;
  openOverlay: (overlay: Exclude<OverlayType, null>) => void;
  closeOverlay: () => void;
};

const DashboardOverlayContext =
  createContext<DashboardOverlayContextValue | undefined>(undefined);

export function DashboardOverlayProvider({ children }: { children: ReactNode }) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  function openOverlay(overlay: Exclude<OverlayType, null>) {
    setActiveOverlay(overlay);
  }

  function closeOverlay() {
    setActiveOverlay(null);
  }

  return (
    <DashboardOverlayContext.Provider
      value={{ activeOverlay, openOverlay, closeOverlay }}
    >
      {children}
    </DashboardOverlayContext.Provider>
  );
}

export function useDashboardOverlay() {
  const ctx = useContext(DashboardOverlayContext);
  if (!ctx) {
    throw new Error(
      "useDashboardOverlay must be used inside DashboardOverlayProvider"
    );
  }
  return ctx;
}

