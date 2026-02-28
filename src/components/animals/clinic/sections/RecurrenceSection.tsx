"use client";

import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";

type Props = {
  form: TreatmentScheduleForm;
};

export function RecurrenceSection({ form }: Props) {
  return (
    <div className="space-y-3">

      <label className="text-xs text-zinc-600">
        Término da prescrição
      </label>

      <select
        value={form.mode}
        onChange={(e) =>
          form.setMode(e.target.value as any)
        }
        className="w-full rounded border px-2 py-1 text-sm"
      >
        <option value="COUNT">Nº repetições</option>
        <option value="UNTIL">Data final</option>
      </select>

      {form.mode === "COUNT" && (
        <input
          type="number"
          min={1}
          max={form.MAX_COUNT}
          value={form.count}
          onChange={(e) =>
            form.setCount(Number(e.target.value))
          }
          className="w-full rounded border px-2 py-1 text-sm"
        />
      )}

      {form.mode === "UNTIL" && (
        <input
          type="date"
          value={form.until}
          onChange={(e) =>
            form.setUntil(e.target.value)
          }
          className="w-full rounded border px-2 py-1 text-sm"
        />
      )}
    </div>
  );
}