// path: frontend/src/services/animalAgenda.ts

import { apiFetch } from "./api";

export type AgendaView = "day" | "week" | "month" | "year";

// path: frontend/src/services/animalAgenda.ts

export type AgendaItem = {
  id: number;
  type: "task" | "event" | "appointment";

  title: string;
  description: string | null;

  status: string;
  priority: number;

  starts_at: string | null;
  ends_at: string | null;

  // ✅ ESSENCIAL
  source: "MANUAL" | "TREATMENT" | "SYSTEM" | "BOOKING";

  // ✅ ORIGEM CLÍNICA
  treatment_public_id?: string | null;
  treatment_schedule_public_id?: string | null;

  created_by: {
    person_public_id: string;
    name: string;
  };

  // (opcional, mas já existe no backend)
  last_action?: unknown | null;
  recurrence_context?: unknown | null;
};

export type AnimalAgendaResponse = {
  animal_id: string;
  view: AgendaView;
  from: string;
  to: string;
  items: AgendaItem[];
};

export async function getAnimalAgenda(
  animalId: string,
  view: AgendaView,
  ref: string
): Promise<AnimalAgendaResponse> {
  const qs = new URLSearchParams({ view, ref }).toString();

  return apiFetch(
    `/api/v1/animals/${animalId}/agenda?${qs}`
  );
}
