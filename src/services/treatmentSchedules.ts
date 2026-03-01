import { http } from "@/services/http";

export type TreatmentFrequencyType = "daily_times" | "interval_days";

export type CreateTreatmentSchedulePayload = {
  frequency_type: string;
  starts_at: string;
  ends_at: string | null;

  interval_in_days?: number | null;
  daily_times_count?: number | null;
  daily_times?: string[] | null;

  administration_route_public_id: string;

  dosage_unit_public_id?: string | null;
  dosage_amount?: string | null;

  dosage_per_unit?: string | null;
  strength_unit_public_id?: string | null; // 👈 ADICIONAR AQUI

  medication_name?: string | null;
  notes?: string | null;

  should_generate_agenda: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createTreatmentSchedule(
  treatmentPublicId: string,
  payload: CreateTreatmentSchedulePayload
): Promise<{
  schedule_public_id: string;
  schedule_id?: number;
  status?: string;
}> {
  return http(
    `/api/v1/treatments/${treatmentPublicId}/schedules`,
    {
      method: "POST",
      body: payload,
    }
  );
}