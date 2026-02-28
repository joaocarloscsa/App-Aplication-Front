// /var/www/GSA/animal/frontend/src/services/animalTreatments.ts

import { http } from "@/services/http";

/* =========================
 * Shared DTOs
 * ========================= */

export type PersonRefDTO = {
  person_public_id: string;
  name: string;
};

export type TreatmentScheduleDTO = {
  schedule_public_id: string;
  medication_name?: string | null;

  administration_route: {
    code: string;
    label: string;
    display_label: string;
  };

  frequency: {
    type: "daily_times" | "interval_days";
    daily?: {
      times_per_day?: number | null;
      times?: string[] | null;
    };
    interval?: {
      days?: number | null;
      execution_time?: string | null;
    };
  };

  dosage?: {
    amount?: string | null;
    unit?: {
      code: string;
      label: string;
    } | null;
    strength?: {
      value?: string | null;
      unit?: {
        code: string;
        label: string;
      } | null;
    } | null;
  } | null;

  period: {
    starts_at: string;
    ends_at?: string | null;
  };

  meta: {
    created_at: string;
    status: string;
    agenda_generated: boolean;
  };

  created_by?: {
    person_public_id: string;
    name: string;
  } | null;

  notes?: string | null;
  status_history?: any[];
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
  created_by?: PersonRefDTO | null;
  actor?: {
    role_at_creation?: string | null;
    role_source?: string | null;
  };
  schedules: TreatmentScheduleDTO[];
};

/* =========================
 * Fetch
 * ========================= */

type AnimalTreatmentsResponse = {
  treatments: TreatmentDTO[];
};

export async function fetchAnimalTreatments(
  animalPublicId: string
): Promise<TreatmentDTO[]> {
  const res = (await http(
    `/api/v1/animals/${animalPublicId}/treatments`
  )) as AnimalTreatmentsResponse;

  return res.treatments ?? [];
}

/* =========================
 * Create Treatment (RESTORED)
 * ========================= */

export type CreateAnimalTreatmentPayload = {
  name: string;
  notes?: string | null;
  starts_at: string;
};

export async function createAnimalTreatment(
  animalPublicId: string,
  payload: CreateAnimalTreatmentPayload
): Promise<{
  treatment_public_id: string;
}> {
  return http(
    `/api/v1/animals/${animalPublicId}/treatments`,
    {
      method: "POST",
      body: payload,
    }
  );
}