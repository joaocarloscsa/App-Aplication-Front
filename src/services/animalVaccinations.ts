// path: frontend/src/services/animalVaccinations.ts

import { http } from "@/services/http";

export type PersonRefDTO = {
  person_public_id: string;
  name: string;
};

export type VaccinationDoseDTO = {
  public_id: string;
  dose_number: number | null;
  scheduled_at?: string | null;
  applied_at?: string | null;
  next_dose_at?: string | null;
  status: string;
  notes?: string | null;
  actor?: PersonRefDTO | null;
};

export type VaccinationEventDTO = {
  public_id: string;
  type: string;
  dose?: string | null;
  comment?: string | null;
  actor?: string | null;
  created_at: string;
};

export type VaccinationDTO = {
  vaccination_public_id: string;
  vaccine_name: string;
  vaccination_type: "initial" | "booster" | "annual";
  manufacturer?: string | null;
  batch_number?: string | null;
  expiration_date?: string | null;
  status: string;
  created_at?: string | null;
  doses: VaccinationDoseDTO[];
  events: VaccinationEventDTO[];
};

export type CreateAnimalVaccinationPayload = {
  vaccine_name: string;
  vaccination_type?: "initial" | "booster" | "annual";
  dose_number?: number | null;
  manufacturer?: string | null;
  batch_number?: string | null;
  expiration_date?: string | null;
  applied_at?: string | null;
  next_dose_at?: string | null;
  notes?: string | null;
};

export type ApplyVaccinationDosePayload = {
  applied_at: string;
  comment?: string | null;
};

export type CancelVaccinationProtocolPayload = {
  comment?: string | null;
};

export type RestartVaccinationProtocolPayload = {
  start_date: string;
  comment?: string | null;
};

export type VaccinationCardReadResponse = {
  url: string;
  expires_in: number;
  created_at?: string | null;
};

export async function fetchAnimalVaccinations(
  animalPublicId: string
): Promise<VaccinationDTO[]> {
  return http(`/api/v1/animals/${animalPublicId}/vaccinations`);
}

export async function createAnimalVaccination(
  animalPublicId: string,
  payload: CreateAnimalVaccinationPayload
): Promise<{
  vaccination_public_id: string;
}> {
  return http(`/api/v1/animals/${animalPublicId}/vaccinations`, {
    method: "POST",
    body: payload,
  });
}

export async function applyVaccinationDose(
  dosePublicId: string,
  payload: ApplyVaccinationDosePayload
): Promise<{ status: string }> {
  return http(`/api/v1/vaccination-doses/${dosePublicId}/apply`, {
    method: "POST",
    body: payload,
  });
}

export async function cancelVaccinationProtocol(
  vaccinationPublicId: string,
  payload: CancelVaccinationProtocolPayload = {}
): Promise<{ status: string }> {
  return http(`/api/v1/vaccinations/${vaccinationPublicId}/cancel`, {
    method: "POST",
    body: payload,
  });
}

export async function restartVaccinationProtocol(
  vaccinationPublicId: string,
  payload: RestartVaccinationProtocolPayload
): Promise<{ vaccination_public_id?: string; status?: string }> {
  return http(`/api/v1/vaccinations/${vaccinationPublicId}/restart`, {
    method: "POST",
    body: payload,
  });
}

export async function uploadVaccinationCard(
  vaccinationPublicId: string,
  file: File
): Promise<{
  vaccination_public_id?: string;
  file_id?: number;
  card?: {
    read_url?: string;
  };
}> {
  const form = new FormData();
  form.append("file", file);

  return http(`/api/v1/vaccinations/${vaccinationPublicId}/card`, {
    method: "POST",
    body: form,
  });
}

export async function readVaccinationCard(
  vaccinationPublicId: string
): Promise<VaccinationCardReadResponse> {
  return http(`/api/v1/vaccinations/${vaccinationPublicId}/card/read`);
}