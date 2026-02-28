// /var/www/GSA/animal/frontend/src/components/animals/clinic/AnimalTreatmentScheduleCreateForm.tsx
"use client";

import { useEffect, useState } from "react";
import { createTreatmentSchedule } from "@/services/treatmentSchedules";
import {
  fetchAdministrationRoutes,
  AdministrationRouteDTO,
} from "@/services/treatmentConfig";

import { useTreatmentScheduleForm } from "./hooks/useTreatmentScheduleForm";

import { RouteSection } from "./sections/RouteSection";
import { DosageSection } from "./sections/DosageSection";
import { FrequencySection } from "./sections/FrequencySection";
import { RecurrenceSection } from "./sections/RecurrenceSection";
import { TimesSection } from "./sections/TimesSection";
import { PreviewSection } from "./sections/PreviewSection";

type Props = {
  treatmentPublicId: string;
  onCreated: () => Promise<void> | void;
};

function ymdToUtcStartIso(ymd: string): string {
  // 2026-02-28 -> 2026-02-28T00:00:00.000Z (sem drift de timezone)
  return `${ymd}T00:00:00.000Z`;
}

function isoToYmd(iso: string): string {
  // assume ISO Z; pega apenas YYYY-MM-DD
  return iso.slice(0, 10);
}

export function AnimalTreatmentScheduleCreateForm({
  treatmentPublicId,
  onCreated,
}: Props) {
  const form = useTreatmentScheduleForm();

  const [routes, setRoutes] = useState<AdministrationRouteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdministrationRoutes().then(setRoutes);
  }, []);

  const selectedRouteObj = routes.find(
    (r) => r.public_id === form.selectedRoute
  );

  async function submit() {
    setError(null);

    if (!form.selectedRoute) {
      setError("Via obrigatória.");
      return;
    }

    if (!form.startsAt) {
      setError("Data inicial obrigatória.");
      return;
    }

    try {
      setLoading(true);

      // ✅ datas em UTC explícito (sem timezone drift)
      const startsAtIso = ymdToUtcStartIso(form.startsAt);

      // form.endsAt hoje é ISO (do hook). Vamos normalizar pra YYYY-MM-DD e voltar pra UTC start.
      const endsAtIso = form.endsAt ? ymdToUtcStartIso(isoToYmd(form.endsAt)) : null;

      await createTreatmentSchedule(treatmentPublicId, {
        frequency_type: "daily_times",

        starts_at: startsAtIso,
        ends_at: endsAtIso,

        interval_in_days: form.intervalInDays,

        daily_times_count: form.times.length,
        daily_times: form.times,

        administration_route_public_id: form.selectedRoute,

        dosage_unit_public_id: form.selectedUnit || null,

        dosage_amount:
          form.dosageAmount === "" ? null : String(form.dosageAmount),

        dosage_per_unit:
          form.strengthValue === "" ? null : String(form.strengthValue),

        medication_name: form.medicationName || null,
        notes: form.notes || null,

        should_generate_agenda: true,
      });

      await onCreated();
    } catch {
      setError("Erro ao criar prescrição.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-5 space-y-5 text-sm shadow-sm">
      {error && <p className="text-red-600">{error}</p>}

      <RouteSection form={form} routes={routes} />
      <DosageSection form={form} selectedRouteObj={selectedRouteObj} />
      <FrequencySection form={form} />
      <TimesSection form={form} />
      <RecurrenceSection form={form} />
      <PreviewSection form={form} />

      {/* OBSERVAÇÕES */}
      <div>
        <label className="text-xs text-zinc-600">Observações clínicas</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => form.setNotes(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="bg-zinc-900 text-white px-4 py-1.5 rounded"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}