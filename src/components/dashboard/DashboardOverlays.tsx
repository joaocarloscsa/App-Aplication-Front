"use client";

import { useDashboardOverlay } from "./DashboardOverlayContext";

import { AlertsOverlay } from "./AlertsOverlay";
import { StorageOverlay } from "./StorageOverlay";
import { UserOverlay } from "./UserOverlay";
import { AnimalsOverlay } from "./AnimalsOverlay";

export function DashboardOverlays() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();

  if (!activeOverlay) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop global */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeOverlay}
      />

      {/* conteúdo */}
      <div className="relative z-10 flex h-full w-full justify-center p-4 overflow-y-auto">


        {activeOverlay === "user" && <UserOverlay />}
        {activeOverlay === "animals" && <AnimalsOverlay />}
        {activeOverlay === "storage" && <StorageOverlay />}
        {activeOverlay === "alerts" && <AlertsOverlay />}
      </div>
    </div>
  );
}

