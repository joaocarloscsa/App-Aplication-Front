import { http } from "@/services/http"
import type { AnimalVaccination } from "@/types/vaccination"

export type CreateAnimalVaccinationPayload = {
  product_id: number
  protocol_id?: number
  dose_number?: number
  applied_at: string
  next_dose_at?: string
  batch_number?: string
  expiration_date?: string
  notes?: string
}

export async function fetchAnimalVaccinations(
  animalId: string
): Promise<AnimalVaccination[]> {
  return http(`/api/v1/animals/${animalId}/vaccinations`)
}

export async function createAnimalVaccination(
  animalId: string,
  payload: CreateAnimalVaccinationPayload
) {
  return http(`/api/v1/animals/${animalId}/vaccinations`, {
    method: "POST",
    body: payload
  })
}

export async function applyVaccinationDose(
  doseId: string
) {
  return http(`/api/v1/vaccination-doses/${doseId}/apply`, {
    method: "POST",
    body: {
      applied_at: new Date().toISOString()
    }
  })
}