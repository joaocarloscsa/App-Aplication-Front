"use client";

type Event = {
  action: "paused" | "resumed" | "finished" | "cancelled";
  notes: string;
  performed_at: string;
  performed_by: {
    person_public_id: string;
    name: string;
  } | null;
};

type Props = {
  events: Event[];
};

export function TreatmentScheduleTimeline({ events }: Props) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mt-2 border-t pt-2 space-y-2">
      <p className="text-xs font-semibold text-zinc-700">
        Histórico da prescrição
      </p>

      <ul className="space-y-1">
        {events.map((e, i) => (
          <li
            key={i}
            className="text-xs text-zinc-600 flex flex-col gap-0.5"
          >
            <span>
              <strong>{humanizeAction(e.action)}</strong>{" "}
              em {new Date(e.performed_at).toLocaleString()}
            </span>

            {e.performed_by && (
              <span className="text-[11px] text-zinc-500">
                por {e.performed_by.name} ({e.performed_by.person_public_id})
              </span>
            )}

            {e.notes && (
              <span className="italic text-zinc-500">
                “{e.notes}”
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function humanizeAction(action: string) {
  return {
    paused: "Suspensa",
    resumed: "Retomada",
    finished: "Finalizada",
    cancelled: "Cancelada",
  }[action] ?? action;
}