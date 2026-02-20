// path: src/services/treatmentSchedules.ts

import { http } from "@/services/http";

export type CreateTreatmentSchedulePayload = {
  frequency: string;
  times_per_day?: number | null;
  times?: string[] | null;
  interval_days?: number | null;
  preferred_time?: string | null;
  dosage?: string | null;
  starts_at: string;
  ends_at?: string | null;
  generate_agenda?: boolean;
};

export type CreateTreatmentScheduleResponse = {
  schedule_public_id: string;
};

export async function createTreatmentSchedule(
  treatmentPublicId: string,
  payload: CreateTreatmentSchedulePayload
): Promise<CreateTreatmentScheduleResponse> {
  return http<CreateTreatmentScheduleResponse>(
    `/api/v1/treatments/${treatmentPublicId}/schedules`,
    {
      method: "POST",
      body: payload,
    }
  );
}
