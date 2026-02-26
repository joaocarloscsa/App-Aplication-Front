// path: frontend/src/services/animalTasks.ts

import { apiFetch } from "@/services/api";
import type {
  AnimalTaskListResponse,
} from "@/types/agenda";

export async function getAnimalTasks(
  animalId: string,
  params?: {
    from?: string;
    to?: string;
    status?: string;
  }
): Promise<AnimalTaskListResponse> {
  const qs = new URLSearchParams();
  if (params?.from) qs.set("from", params.from);
  if (params?.to) qs.set("to", params.to);
  if (params?.status) qs.set("status", params.status);

  const query = qs.toString();
  const url = `/api/v1/animals/${animalId}/tasks${query ? `?${query}` : ""}`;

  return apiFetch(url, { method: "GET" });
}

export async function createAnimalTask(
  animalId: string,
  payload: any
): Promise<{ id: number }> {
  return apiFetch(`/api/v1/animals/${animalId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function markTaskDone(
  animalId: string,
  taskId: number,
  comment?: string | null
) {
  return apiFetch(
    `/api/v1/animals/${animalId}/tasks/${taskId}/done`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body:
        comment !== undefined
          ? JSON.stringify({ comment })
          : undefined,
    }
  );
}

export async function reopenTask(
  animalId: string,
  taskId: number,
  comment?: string | null
) {
  return apiFetch(
    `/api/v1/animals/${animalId}/tasks/${taskId}/reopen`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body:
        comment !== undefined
          ? JSON.stringify({ comment })
          : undefined,
    }
  );
}

export async function cancelTask(
  animalId: string,
  taskId: number,
  comment?: string | null
) {
  return apiFetch(
    `/api/v1/animals/${animalId}/tasks/${taskId}/cancel`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body:
        comment !== undefined
          ? JSON.stringify({ comment })
          : undefined,
    }
  );
}

// frontend/src/services/animalTasks.ts
export async function cancelTaskRecurrence(
  animalId: string,
  taskId: number,
  comment?: string | null,
  cancelMaster: boolean = true
): Promise<void> {
  await apiFetch(
    `/api/v1/animals/${animalId}/tasks/${taskId}/cancel-recurrence`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cancel_master: cancelMaster,
        comment: comment ?? null,
      }),
    }
  );
}


