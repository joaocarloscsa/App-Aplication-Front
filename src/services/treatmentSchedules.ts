// path: frontend/src/services/treatmentSchedules.ts

import { apiFetch } from "@/services/api";

export type CreateTreatmentSchedulePayload = {
  frequency_type: "interval_days";

  starts_at: string; // ISO datetime
  ends_at?: string | null; // ISO datetime | null

  interval_days: number;
  preferred_time?: string | null; // "HH:mm"

  dosage?: string | null;
  generate_agenda?: boolean;
};

export async function createTreatmentSchedule(
  treatmentPublicId: string,
  payload: CreateTreatmentSchedulePayload
): Promise<{ status: "created"; schedule_id: number }> {
  return apiFetch(`/api/v1/treatments/${treatmentPublicId}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}