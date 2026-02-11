"use client";

import { Card } from "./Card";
import { useMe } from "@/components/MeContext";
import { useDashboardOverlay } from "./DashboardOverlayContext";

export function AnimalsCard() {
  const { me, loading } = useMe();
  const { openOverlay } = useDashboardOverlay();

  if (loading || !me) {
    return (
      <Card title="Animais">
        <p className="text-sm text-zinc-400">—</p>
      </Card>
    );
  }

  const total = me.animals?.total ?? 0;

  return (
    <Card title="Animais">
      <button
        type="button"
        onClick={() => openOverlay("animals")}
        className="w-full text-left"
      >
        <p className="text-2xl font-bold text-zinc-900">
          {total}
        </p>
        <p className="text-sm text-zinc-500">
          cadastrados
        </p>
      </button>
    </Card>
  );
}
