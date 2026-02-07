// /var/www/GSA/animal/frontend/src/components/dashboard/AlertsOverlay.tsx

"use client";

import { useDashboardOverlay } from "./DashboardOverlayContext";
import { useMe } from "@/components/MeContext";
import { http } from "@/services/http";

export function AlertsOverlay() {
  const { activeOverlay, closeOverlay } = useDashboardOverlay();
  const { me, reloadMe } = useMe();

  if (activeOverlay !== "alerts" || !me) return null;

  const decisions = me.alerts?.decisions?.pending ?? [];
  const communications = me.alerts?.communications?.unread ?? [];

  const hasAlerts = decisions.length > 0 || communications.length > 0;

  async function handleAction(alertPublicId: string, action: string) {
    await http(`/api/v1/me/alerts/${alertPublicId}/${action}`, {
      method: "POST",
      credentials: "include",
    });
    await reloadMe();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-semibold">Alertas</h2>
          <button onClick={closeOverlay}>✕</button>
        </div>

        {/* SCROLL CONTAINER (sem padding lateral) */}
        <div
          className={`flex-1 ${
            hasAlerts ? "max-h-[70vh] overflow-y-auto" : "flex items-center justify-center"
          }`}
          style={{
            scrollbarGutter: "stable",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* CONTENT WRAPPER (padding seguro) */}
          <div className="px-5 pt-5 pb-6 space-y-6 box-border">

            {/* Decisions */}
            {decisions.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-700">
                  Requer ação
                </h3>
                <ul className="space-y-3">
                  {decisions.map((a: any) => (
                    <li
                      key={a.public_id}
                      className="w-full rounded-xl border p-4 box-border"
                    >
                      <p className="font-semibold">{a.ui?.title}</p>
                      <p className="text-sm text-zinc-600">
                        {a.ui?.message}
                      </p>
                      <div className="mt-3 flex gap-2">
                        {a.ui?.actions?.map((action: string) => (
                          <button
                            key={action}
                            onClick={() =>
                              handleAction(a.public_id, action)
                            }
                            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Communications */}
            {communications.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-700">
                  Comunicações
                </h3>
                <ul className="space-y-3">
                  {communications.map((a: any) => (
                    <li
                      key={a.public_id}
                      className="w-full rounded-xl border p-4 box-border"
                    >
                      <p className="font-semibold">{a.ui?.title}</p>
                      <p className="text-sm text-zinc-600">
                        {a.ui?.message}
                      </p>
                      {a.ui?.actions?.includes("acknowledge") && (
                        <div className="mt-3">
                          <button
                            onClick={() =>
                              handleAction(a.public_id, "acknowledge")
                            }
                            className="rounded-lg border px-4 py-2 text-sm"
                          >
                            Ok
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Empty */}
            {!hasAlerts && (
              <p className="text-sm text-zinc-500">
                Nenhum alerta no momento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
