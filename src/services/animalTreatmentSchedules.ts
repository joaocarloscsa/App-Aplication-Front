export type CreateTreatmentSchedulePayload = {
  frequency_type: "daily_times" | "interval_days";

  starts_at: string;
  ends_at?: string | null;

  // daily_times
  daily_times_count?: number;
  daily_times?: string[];

  // interval_days
  interval_in_days?: number;
  interval_execution_time?: string | null;

  dosage_description?: string | null;
  dosage_amount?: string | null;
  dosage_unit?: string | null;
  dosage_per_unit?: string | null;

  medication_name?: string | null;
  notes?: string | null;

  should_generate_agenda?: boolean;
};
