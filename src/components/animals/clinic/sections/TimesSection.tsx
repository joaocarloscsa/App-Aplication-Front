// /var/www/GSA/animal/frontend/src/components/animals/clinic/sections/TimesSection.tsx
"use client";

import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";

type Props = {
  form: TreatmentScheduleForm;
};

export function TimesSection({ form }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-zinc-600">Vezes por dia</label>
        <input
          type="number"
          min={1}
          max={4}
          value={form.timesPerDay}
          onChange={(e) =>
            form.setTimesPerDay(
              Math.min(Math.max(Number(e.target.value), 1), 4)
            )
          }
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: form.timesPerDay }, (_, i) => (
          <input
            key={i}
            type="time"
            value={form.times[i] ?? "08:00"}
            onChange={(e) => {
              const copy = [...form.times];
              copy[i] = e.target.value;
              form.setTimes(copy);
            }}
            className="rounded border px-2 py-1 text-sm"
          />
        ))}
      </div>
    </div>
  );
}