// /var/www/GSA/animal/frontend/src/components/dashboard/AlertsCard.tsx

"use client";

import { Card } from "./Card";
import { useMe } from "@/components/MeContext";
import { useDashboardOverlay } from "./DashboardOverlayContext";

function getPendingAlerts(me: any): any[] {
  if (Array.isArray(me?.alerts?.pending)) return me.alerts.pending;
  if (Array.isArray(me?.storage?.alerts?.pending))
    return me.storage.alerts.pending;
  return [];
}

export function AlertsCard() {
  const { me } = useMe();
  const { openOverlay } = useDashboardOverlay();

  const pending = getPendingAlerts(me);
  const count = pending.length;

  return (
    <Card title="Alertas">
      <button
        type="button"
        onClick={() => openOverlay("alerts")}
        className="w-full text-left"
      >
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-zinc-500">pendentes</p>
      </button>
    </Card>
  );
}

