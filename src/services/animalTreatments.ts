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

  frequency: string;
  times_per_day?: number | null;
  times?: string[] | null;
  interval_days?: number | null;
  preferred_time?: string | null;
  dosage?: string | null;

  generate_agenda: boolean;
  agenda_generated: boolean;

  status: string;
  starts_at: string;
  ends_at?: string | null;
  created_at: string;
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