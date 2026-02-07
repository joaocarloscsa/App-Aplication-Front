"use client";

import { useMe } from "@/components/MeContext";
import { Card } from "./Card";
import { useDashboardOverlay } from "./DashboardOverlayContext";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  const decimals = i === 0 ? 0 : v < 10 ? 2 : 1;
  return `${v.toFixed(decimals)} ${units[i]}`;
}

export function StorageCard() {
  const { me } = useMe();
  const { openOverlay } = useDashboardOverlay();

  const storage = me?.storage;
  const totalUsed = storage?.total_used_bytes ?? 0;

  return (
    <Card title="Storage">
      <button
        type="button"
        onClick={() => openOverlay("storage")}
        className="w-full text-left"
      >
        <p className="text-2xl font-bold text-zinc-900">
          {formatBytes(totalUsed)}
        </p>
        <p className="text-sm text-zinc-500">
          usado no total
        </p>
      </button>
    </Card>
  );
}

