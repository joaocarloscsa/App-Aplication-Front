import { http } from "@/services/http"

export type VaccineManufacturerDTO = {
  id: number
  name: string
}

export type VaccineProtocolDoseDTO = {
  dose_number: number
  min_age_days: number
  recommended_age_days: number
  max_age_days?: number | null
}

export type VaccineProtocolDTO = {
  id: number
  name: string
  type: string
  dose_count: number
  interval_days: number
  booster_interval_days?: number | null
  max_delay_days?: number | null
  priority?: number
  notes?: string | null
  doses: VaccineProtocolDoseDTO[]
}

export type VaccineProductDTO = {
  id: number
  code: string
  name: string
  manufacturer: string
  species: string
  diseases: string[]
  protocols: VaccineProtocolDTO[]
}

export async function fetchVaccineManufacturers(): Promise<VaccineManufacturerDTO[]> {
  return http("/api/v1/vaccine-manufacturers")
}

export async function fetchManufacturerVaccines(
  manufacturerId: number,
  species: string
): Promise<VaccineProductDTO[]> {
  return http(
    `/api/v1/vaccine-products?manufacturer_id=${manufacturerId}&species=${species}`
  )
}