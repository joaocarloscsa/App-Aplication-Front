"use client";

import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";

type Props = {
  form: TreatmentScheduleForm;
};

export function FrequencySection({ form }: Props) {
  return (
    <div className="space-y-4">
      {/* DATA INICIAL */}
      <div>
        <label className="text-xs text-zinc-600">Início</label>
        <input
          type="date"
          value={form.startsAt}
          onChange={(e) => form.setStartsAt(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>

      {/* INTERVALO EM DIAS */}
      <div>
        <label className="text-xs text-zinc-600">
          A cada (dias)
        </label>
        <input
          type="number"
          min={1}
          value={form.intervalInDays}
          onChange={(e) =>
            form.setIntervalInDays(Number(e.target.value))
          }
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
}