"use client";

import { useDashboardOverlay } from "./DashboardOverlayContext";
import { useMe } from "@/components/MeContext";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function StorageOverlay() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();
  const { me } = useMe();

  if (activeOverlay !== "storage") return null;

  const storage = me?.storage;
  if (!storage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOverlay}
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
         
         
          <h2 className="text-lg font-semibold text-zinc-900">Uso de Storage</h2>


          <button
            onClick={closeOverlay}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Fechar
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Usuário</span>
            <strong>{formatBytes(storage.person_used_bytes)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Animais</span>
            <strong>{formatBytes(storage.animals_used_bytes)}</strong>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatBytes(storage.total_used_bytes)}</span>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold">Por animal</h3>
            <ul className="space-y-2">
              {storage.by_animal.items.map((a) => (
                <li
                  key={a.animal_public_id}
                  className="flex justify-between rounded-lg bg-zinc-50 px-3 py-2"
                >
                  <span>{a.animal_public_id}</span>
                  <span>{formatBytes(a.used_bytes)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

