// /var/www/GSA/animal/frontend/src/components/animals/clinic/TreatmentScheduleTimeline.tsx
"use client";

type Event = {
  action: string; // <- aceitar string real do backend
  notes?: string | null;
  performed_at: string;
  performed_by?: {
    person_public_id: string;
    name: string;
  } | null;
};

type Props = {
  events: Event[];
};

function humanizeAction(action: string) {
  switch (action) {
    case "paused":
      return "Suspenso";
    case "finished":
      return "Finalizado";
    case "cancelled":
      return "Cancelado";
    case "resumed":
      return "Reativado";
    case "created":
      return "Criado";
    default:
      return action;
  }
}

export function TreatmentScheduleTimeline({ events }: Props) {
  if (!events || events.length === 0) return null;

  return (
    <div className="border-t pt-2 space-y-2 text-xs">
      {events.map((e, idx) => (
        <div key={idx} className="text-zinc-600">
          <div>
            <span className="font-medium">
              {humanizeAction(e.action)}
            </span>{" "}
            em{" "}
            {new Date(e.performed_at).toLocaleString("pt-PT")}
          </div>

          {e.performed_by && (
            <div>
              por{" "}
              <span className="font-medium">
                {e.performed_by.name}
              </span>
            </div>
          )}

          {e.notes && (
            <div className="italic text-zinc-500">
              {e.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}