// path: src/services/animalTreatments.ts

import { http } from "@/services/http";
import { apiFetch } from "@/services/api";

/* =========================
   TYPES (READ)
========================= */

export type TreatmentCreatedByDTO = {
  person_public_id: string;
  name: string;
};

export type TreatmentActorDTO = {
  role_at_creation: string;
  role_source: string;
};

export type TreatmentScheduleDTO = {
  schedule_id: number;
  schedule_public_id: string;

  frequency_type: "daily_times" | "interval_days";

  // DAILY_TIMES
  daily_times_count: number | null;
  daily_times: string[] | null;

  // INTERVAL_DAYS
  interval_in_days: number | null;
  interval_execution_time: string | null;

  // DOSAGEM
  dosage_description: string | null;
  dosage_amount: string | null;
  dosage_unit: string | null;
  dosage_per_unit: string | null;

  notes: string | null;

  starts_at: string;
  ends_at: string | null;
  created_at: string;

  status: string;
  agenda_was_generated: boolean;
};

export type TreatmentDTO = {
  treatment_id: number;
  treatment_public_id: string;

  name: string;
  notes?: string | null;
  status: string;

  starts_at: string;
  ends_at?: string | null;
  created_at: string;

  created_by?: TreatmentCreatedByDTO | null;
  actor: TreatmentActorDTO;

  schedules: TreatmentScheduleDTO[];
};

export type TreatmentListResponse = {
  treatments: TreatmentDTO[];
};

/* =========================
   LIST TREATMENTS
========================= */

export async function fetchAnimalTreatments(
  animalPublicId: string
): Promise<TreatmentDTO[]> {
  const res = await http<TreatmentListResponse>(
    `/api/v1/animals/${animalPublicId}/treatments`,
    { method: "GET" }
  );

  return res.treatments ?? [];
}

/* =========================
   CREATE TREATMENT
========================= */

export type CreateTreatmentPayload = {
  name: string;
  starts_at: string; // ISO
  ends_at?: string | null;

  notes?: string | null;

  actor_role_at_creation: string;
  actor_role_source: string;
};

export type CreateTreatmentResponse = {
  treatment_public_id: string;
};

export async function createAnimalTreatment(
  animalPublicId: string,
  payload: CreateTreatmentPayload
): Promise<string> {
  const res = await http<{ treatment_public_id: string }>(
    `/api/v1/animals/${animalPublicId}/treatments`,
    {
      method: "POST",
      body: payload,
    }
  );

  return res.treatment_public_id;
}