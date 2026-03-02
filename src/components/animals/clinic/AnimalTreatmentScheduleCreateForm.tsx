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
  return `${ymd}T00:00:00.000Z`;
}

function isoToYmd(iso: string): string {
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

useEffect(() => {
  if (!form.selectedRoute) return;
  if (!routes.length) return;

  const route = routes.find(
    (r) => r.public_id === form.selectedRoute
  );

  if (!route) return;

  const units = route.allowed_units ?? [];
  const singleUnit = units.length === 1 ? units[0] : null;

  if (singleUnit) {
    form.setSelectedUnit(singleUnit.public_id);

    if (route.rule.allows_strength) {
      form.setStrengthUnitPublicId(singleUnit.public_id);
    }
  }
}, [form.selectedRoute, routes]);

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

      if (selectedRouteObj?.rule.requires_dose_amount && !form.dosageAmount) {
        setError("Quantidade obrigatória.");
        return;
      }

      if (selectedRouteObj?.rule.requires_dose_unit && !form.selectedUnit) {
        setError("Unidade obrigatória.");
        return;
      }

      const startsAtIso = ymdToUtcStartIso(form.startsAt);
      const endsAtIso = form.endsAt
        ? ymdToUtcStartIso(isoToYmd(form.endsAt))
        : null;

      const isProcedure = selectedRouteObj?.rule?.is_procedure;

      await createTreatmentSchedule(treatmentPublicId, {
        frequency_type: "daily_times",
        starts_at: startsAtIso,
        ends_at: endsAtIso,

        interval_in_days: form.intervalInDays,
        daily_times_count: form.times.length,
        daily_times: form.times,

        administration_route_public_id: form.selectedRoute,

        dosage_unit_public_id: isProcedure
          ? null
          : form.selectedUnit || null,

        dosage_amount: isProcedure
          ? null
          : form.dosageAmount === ""
            ? null
            : String(form.dosageAmount),

        dosage_per_unit: isProcedure
          ? null
          : form.strengthValue === ""
            ? null
            : String(form.strengthValue),

       strength_unit_public_id: isProcedure
            ? null
            : form.strengthUnitPublicId || null,

        medication_name: form.medicationName || null,
        notes: form.notes || null,

        should_generate_agenda: true,
      });

      await onCreated();
    } catch (err: any) {
      const apiError = err?.response?.data?.error?.code;

      const messages: Record<string, string> = {
        dose_amount_required: "Quantidade obrigatória.",
        dose_unit_required: "Unidade obrigatória.",
        strength_required: "Concentração obrigatória.",
        strength_not_allowed_for_route:
          "Concentração não permitida para esta via.",
        procedure_cannot_have_dose:
          "Procedimento não pode ter dose.",
      };

      setError(messages[apiError] ?? "Erro ao criar prescrição.");
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

      <div>
        <label className="text-xs text-zinc-600">
          Observações clínicas
        </label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => form.setNotes(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex justify-end">
        {form.isRetroactive && (
  <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
    A data selecionada é retroativa. 
    As tarefas serão criadas apenas a partir da data e horário atual.
  </div>
)}

{form.hasFirstTimeAlreadyPassed && !form.isRetroactive && (
  <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
    O horário da primeira dose já passou hoje. 
    A primeira tarefa será criada no próximo ciclo.
  </div>
)}
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