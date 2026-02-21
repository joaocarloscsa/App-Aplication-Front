// path: frontend/src/services/treatmentSchedules.ts

export type TreatmentFrequencyType = "daily_times" | "interval_days";

export type CreateTreatmentSchedulePayload = {
  frequency_type: TreatmentFrequencyType;

  starts_at: string; // ISO
  ends_at: string | null; // ISO | null

  // === NOVOS NOMES (alinhados com a entidade nova) ===
  interval_in_days?: number | null;
  interval_execution_time?: string | null; // "HH:mm"

  daily_times_count?: number | null;
  daily_times?: string[] | null; // ["08:00","20:00"]

  medication_name?: string | null;

  dosage_description?: string | null;
  dosage_amount?: string | null; // "2.00"
  dosage_unit?: string | null; // "gotas" | "comprimido" | "mg" | "g" | "ml"
  dosage_per_unit?: string | null; // "5.00" (mg por comprimido)
  notes?: string | null;

  should_generate_agenda?: boolean;

  // === LEGACY (pra não estourar outras telas agora) ===
  // remove depois que tudo estiver migrado
  interval_days?: number | null;
  preferred_time?: string | null;
  dosage?: string | null;
  generate_agenda?: boolean;
};

// path: frontend/src/services/treatmentSchedules.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createTreatmentSchedule(
  treatmentPublicId: string,
  payload: CreateTreatmentSchedulePayload
) {
  if (!API_BASE) {
    throw new Error("API_BASE_URL_not_configured");
  }

  const res = await fetch(
    `${API_BASE}/api/v1/treatments/${treatmentPublicId}/schedules`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createTreatmentSchedule_failed: ${text}`);
  }

  return res.json();
}