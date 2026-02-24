// path: frontend/src/services/treatmentSchedules.ts
import { http } from "@/services/http";

export type TreatmentFrequencyType = "daily_times" | "interval_days";

export type CreateTreatmentSchedulePayload = {
  frequency_type: "daily_times" | "interval_days";
  starts_at: string;
  ends_at?: string | null;

  // daily_times
  daily_times_count?: number;
  daily_times?: string[];

  // interval_days
  interval_in_days?: number;
  interval_execution_time?: string | null;

  // extras
  medication_name?: string | null;
  dosage_description?: string | null;
  dosage_amount?: string | null;
  dosage_unit?: string | null;
  dosage_per_unit?: string | null;
  notes?: string | null;

  should_generate_agenda?: boolean;
};


// path: frontend/src/services/treatmentSchedules.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createTreatmentSchedule(
  treatmentPublicId: string,
  payload: CreateTreatmentSchedulePayload
): Promise<{ schedule_public_id: string; schedule_id?: number; status?: string }> {
  return http(`/api/v1/treatments/${treatmentPublicId}/schedules`, {
    method: "POST",
    body: payload,
  });
}