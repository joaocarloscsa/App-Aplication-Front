// path: src/services/animalConsultations.ts

import { http } from "@/services/http";

/* =========================
 * DTOs
 * ========================= */

export type ConsultationSummaryDTO = {
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

export type ConsultationNoteDTO = {
  public_id: string;
  type: "ADDENDUM" | "OBSERVATION" | "CORRECTION";
  content: string;
  created_at: string;
  created_by?: {
    person_public_id: string;
    name: string;
  } | null;
};

export type ConsultationDetailsDTO = {
  consultation: {
    public_id: string;
    type: string;
    status: string;
    date_time: string;
    chief_complaint: string;
    clinical_findings?: string | null;
    diagnostic_impression: string;
    conduct: string;

    temperature?: number | null;
    heart_rate?: number | null;
    respiratory_rate?: number | null;
    weight?: number | null;

    created_by?: {
      person_public_id: string;
      name: string;
    } | null;
  };

  notes: ConsultationNoteDTO[];
  exam_orders: any[];
};

/* =========================
 * LIST CONSULTATIONS
 * ========================= */

export async function fetchAnimalConsultations(
  animalPublicId: string
): Promise<ConsultationSummaryDTO[]> {
  const res = (await http(
    `/api/v1/animals/${animalPublicId}/consultations`
  )) as { consultations: ConsultationSummaryDTO[] };

  return res.consultations ?? [];
}

/* =========================
 * FETCH CONSULTATION DETAILS
 * ========================= */

export async function fetchConsultationDetails(
  consultationPublicId: string
): Promise<ConsultationDetailsDTO> {
  const res: any = await http(
    `/api/v1/consultations/${consultationPublicId}`
  );

  const c = res?.consultations?.[0];

  if (!c) {
    throw new Error("Consulta não encontrada.");
  }

  return {
    consultation: {
      public_id: c.public_id,
      type: c.type,
      status: c.status,
      date_time: c.date_time,
      chief_complaint: c.chief_complaint,
      clinical_findings: c.clinical_findings,
      diagnostic_impression: c.diagnostic_impression,
      conduct: c.conduct,
      temperature: c.temperature,
      heart_rate: c.heart_rate,
      respiratory_rate: c.respiratory_rate,
      weight: c.weight,
      created_by: c.created_by ?? null,
    },

    notes: c.notes ?? [],

    exam_orders: res.exam_orders ?? [],
  };
}

/* =========================
 * CREATE CONSULTATION
 * ========================= */

export type CreateAnimalConsultationPayload = {
  type: string;
  date_time: string;

  chief_complaint: string;
  diagnostic_impression: string;
  conduct: string;

  clinical_findings?: string | null;

  temperature?: number | null;
  heart_rate?: number | null;
  respiratory_rate?: number | null;
  weight?: number | null;
};

export async function createAnimalConsultation(
  animalPublicId: string,
  payload: CreateAnimalConsultationPayload
): Promise<{
  public_id: string;
}> {
  return http(`/api/v1/animals/${animalPublicId}/consultations`, {
    method: "POST",
    body: payload,
  });
}

/* =========================
 * CREATE CONSULTATION NOTE
 * ========================= */

export async function createConsultationNote(
  consultationPublicId: string,
  payload: {
    type: "ADDENDUM" | "OBSERVATION" | "CORRECTION";
    content: string;
  }
) {
  return http(`/api/v1/consultations/${consultationPublicId}/notes`, {
    method: "POST",
    body: payload,
  });
}