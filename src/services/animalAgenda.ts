// path: frontend/src/services/animalAgenda.ts

import { apiFetch } from "./api";

export type AgendaView = "day" | "week" | "month" | "year";

export type AgendaItem = {
  id: number;
  type: "task" | "event" | "appointment";

  title: string;

  /**
   * Texto humano canônico da agenda (tarefa, evento, medicação, etc.)
   */
  description: string | null;

  status: string;
  priority: number;

  starts_at: string | null;
  ends_at: string | null;

  created_by: {
    person_public_id: string;
    name: string;
  };
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
