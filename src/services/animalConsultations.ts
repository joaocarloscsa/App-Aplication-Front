import { http } from "@/services/http";

/* =========================
 * DTOs
 * ========================= */

export type ConsultationDTO = {
  public_id: string;

  type: string;
  status: string;

  date_time: string;

  chief_complaint: string;
  diagnostic_impression: string;
  conduct: string;

  created_at: string;

  created_by?: {
    person_public_id: string;
    name: string;
  } | null;
};

type AnimalConsultationsResponse = {
  consultations: ConsultationDTO[];
};

/* =========================
 * Fetch
 * ========================= */

export async function fetchAnimalConsultations(
  animalPublicId: string
): Promise<ConsultationDTO[]> {
  const res = (await http(
    `/api/v1/animals/${animalPublicId}/consultations`
  )) as AnimalConsultationsResponse;

  return res.consultations ?? [];
}

/* =========================
 * Create
 * ========================= */

export type CreateAnimalConsultationPayload = {
  type: string
  date_time: string

  chief_complaint: string
  diagnostic_impression: string
  conduct: string

  clinical_findings?: string | null

  temperature?: number | null
  heart_rate?: number | null
  respiratory_rate?: number | null
  weight?: number | null
}

export async function createAnimalConsultation(
  animalPublicId: string,
  payload: CreateAnimalConsultationPayload
): Promise<{
  public_id: string;
}> {
  return http(
    `/api/v1/animals/${animalPublicId}/consultations`,
    {
      method: "POST",
      body: payload,
    }
  );
}
