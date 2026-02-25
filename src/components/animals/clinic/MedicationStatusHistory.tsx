// path: frontend/src/components/animals/clinic/MedicationStatusHistory.tsx
"use client";

import { useState } from "react";

type Event = {
  action: string;
  notes: string;
  performed_at: string;
  performed_by?: {
    name: string;
    person_public_id: string;
  } | null;
};

type Props = {
  events: Event[];
};

function humanizeAction(action: string) {
  return {
    paused: "Prescrição suspensa",
    resumed: "Prescrição retomada",
    finished: "Prescrição finalizada",
    cancelled: "Prescrição cancelada",
  }[action] ?? action;
}

export function MedicationStatusHistory({ events }: Props) {
  const [open, setOpen] = useState(false);

  if (!events || events.length === 0) return null;

  return (
    <div className="pt-2 border-t">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-zinc-600 hover:underline"
      >
        {open ? "Ocultar histórico" : "Ver histórico da prescrição"}
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {events.map((e, idx) => (
            <div
              key={idx}
              className="rounded border bg-white p-2 text-xs space-y-0.5"
            >
              <p className="font-medium text-zinc-800">
                {humanizeAction(e.action)}
              </p>

              {e.notes && (
                <p className="text-zinc-700 italic">
                  “{e.notes}”
                </p>
              )}

              <p className="text-zinc-500">
                {new Date(e.performed_at).toLocaleString()}
                {e.performed_by && (
                  <>
                    {" • "}
                    <span className="font-medium">
                      {e.performed_by.name}
                    </span>{" "}
                    <span className="font-mono">
                      ({e.performed_by.person_public_id})
                    </span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
