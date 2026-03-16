export type VaccinationDoseStatus =
  | "scheduled"
  | "applied"
  | "cancelled"

export interface VaccinationDose {
  public_id: string

  dose_number: number | null

  scheduled_at: string | null
  applied_at: string | null

  status: VaccinationDoseStatus

  notes?: string | null
}

export interface ProtocolDose {
  dose_number: number
  min_age_days: number
  recommended_age_days: number
  max_age_days?: number | null
}

export interface AnimalVaccination {
  vaccination_public_id: string

  product_name: string
  manufacturer?: string | null

  protocol_name?: string | null

  protocol_doses?: ProtocolDose[]

  expiration_date?: string | null

  status: string

  created_at?: string | null

  doses: VaccinationDose[]

  next_dose?: VaccinationDose
}