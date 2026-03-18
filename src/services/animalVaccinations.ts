import { http } from "@/services/http"
import type { AnimalVaccination } from "@/types/vaccination"

export type CreateAnimalVaccinationPayload = {
  product_code: string
  protocol_id?: number
  dose_number?: number
  applied_at: string
  expiration_date?: string
  notes?: string

  // ⚠️ mantenha só se quiser override manual consciente
  next_dose_at?: string
}

export type VaccinationDoseResponse = {
  public_id: string
  dose_number: number | null
  scheduled_at: string
  applied_at?: string | null
  status: string
  notes?: string | null
  actor_name?: string | null
  coverage: {
    disease_name: string
    immune_until?: string | null
  }[]
}

export type VaccinationTaskResponse = {
  created: boolean
  exists: boolean
  item: {
    id: number
    title: string
    description?: string | null
    status: string
    type: string
    source: string
    starts_at?: string | null
    ends_at?: string | null
    vaccination_public_id?: string | null
    vaccination_dose_public_id?: string | null
  } | null
}

export type VaccinationImmunityItem = {
  disease_name: string
  immune_until?: string | null
  source_dose_public_id: string
  source_vaccination_public_id: string
  source_vaccine_name: string
  source_manufacturer: string
  applied_at?: string | null
  vaccination_expiration_date?: string | null
}

export type CreateAnimalVaccinationResponse = {
  vaccination: {
    public_id: string
    product_name: string
    manufacturer_name: string
    protocol_name?: string | null
    status: string
    expiration_date?: string | null
    created_at: string
  }

  applied_dose: VaccinationDoseResponse

  next_dose?: VaccinationDoseResponse | null

  task: VaccinationTaskResponse

  immunity: VaccinationImmunityItem[]
}

export async function fetchAnimalVaccinations(
  animalId: string
): Promise<AnimalVaccination[]> {
  return http(`/api/v1/animals/${animalId}/vaccinations`)
}

export async function createAnimalVaccination(
  animalId: string,
  payload: CreateAnimalVaccinationPayload
): Promise<CreateAnimalVaccinationResponse> {
  const response = await http(
    `/api/v1/animals/${animalId}/vaccinations`,
    {
      method: "POST",
      body: payload
    }
  )

  return response as CreateAnimalVaccinationResponse
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