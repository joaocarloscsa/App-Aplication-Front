// /var/www/GSA/animal/frontend/src/components/dashboard/AnimalsCard.tsx

"use client";

import { Card } from "./Card";
import { useMe } from "@/components/MeContext";
import { useDashboardOverlay } from "./DashboardOverlayContext";

export function AnimalsCard() {
  const { me } = useMe();
  const { openOverlay } = useDashboardOverlay();

  const total = (me as any)?.animals?.total ?? (me as any)?.animals?.items?.length ?? 0;

  return (
    <Card title="Animais">
      <button
        type="button"
        onClick={() => openOverlay("animals")}
        className="w-full text-left"
      >
        <p className="text-2xl font-bold text-zinc-900">{total}</p>
        <p className="text-sm text-zinc-500">cadastrados</p>
      </button>
    </Card>
  );
}

