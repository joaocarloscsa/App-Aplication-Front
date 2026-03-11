import { apiFetch } from "@/services/api";

export async function fetchRecurrencePreview(
  animalId: string,
  payload: {
    scheduled_at: string;
    recurrence: {
      interval: number;
      unit: "day" | "month";
      until: string | null;
    };
  },
  signal?: AbortSignal
) {
  return apiFetch(
    `/api/v1/animals/${animalId}/tasks/preview`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    } as RequestInit
  );
}
