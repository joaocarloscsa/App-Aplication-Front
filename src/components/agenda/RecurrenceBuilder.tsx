"use client";

import { useEffect, useMemo, useState } from "react";

import { RecurrenceControls } from "./recurrence/RecurrenceControls";
import { RecurrencePreview } from "./recurrence/RecurrencePreview";
import { useRecurrencePreview } from "./recurrence/useRecurrencePreview";

export type RecurrenceUnit = "day" | "month";
export type RecurrenceMode = "COUNT" | "UNTIL";

export type RecurrenceValue = {
  interval: number;
  unit: RecurrenceUnit;
  until?: string;
};

export type RecurrenceOutput = {
  enabled: boolean;
  recurrence: RecurrenceValue | null;
};

type Props = {
  animalId?: string;
  baseDate: string;
  baseTime?: string | null;
  value: RecurrenceOutput;
  onChange(value: RecurrenceOutput): void;
};

const MAX_COUNT = 365;

export function RecurrenceBuilder({
  animalId,
  baseDate,
  baseTime,
  value,
  onChange,
}: Props) {

  const [interval, setInterval] = useState(1);
  const [unit, setUnit] = useState<RecurrenceUnit>("day");

  const [mode, setMode] = useState<RecurrenceMode>("COUNT");
  const [count, setCount] = useState(5);
  const [until, setUntil] = useState("");

  function computeUntilFromCount(): string {
    const base = new Date(`${baseDate}T00:00:00`);
    const steps = (count - 1) * Math.max(1, interval);

    if (unit === "day") base.setDate(base.getDate() + steps);
    else base.setMonth(base.getMonth() + steps);

    const yyyy = base.getFullYear();
    const mm = String(base.getMonth() + 1).padStart(2, "0");
    const dd = String(base.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  const payload = useMemo(() => {
    if (!value.enabled || !baseDate) return null;

    const hhmm = baseTime?.trim() || "00:00";
    const local = new Date(`${baseDate}T${hhmm}:00`);

    let untilValue: string | undefined;

    if (mode === "UNTIL") {
      if (until) untilValue = until;
    } else {
      if (count < 1 || count > MAX_COUNT) return null;
      untilValue = computeUntilFromCount();
    }

    return {
      scheduled_at: local.toISOString(),
      recurrence: {
        interval,
        unit,
        ...(untilValue ? { until: untilValue } : {})
      },
    };

  }, [value.enabled, baseDate, baseTime, interval, unit, mode, count, until]);

  const { preview, error, loading } =
    useRecurrencePreview(animalId, payload);

  useEffect(() => {
    if (!value.enabled) return;

    let untilValue: string | undefined;

    if (mode === "UNTIL") {
      if (until) untilValue = until;
    } else {
      untilValue = computeUntilFromCount();
    }

    onChange({
      enabled: true,
      recurrence: {
        interval,
        unit,
        ...(untilValue ? { until: untilValue } : {})
      }
    });

  }, [interval, unit, mode, count, until, value.enabled, baseDate]);

  return (
    <div className="space-y-2">

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) =>
            onChange({
              enabled: e.target.checked,
              recurrence: e.target.checked
                ? { interval, unit }
                : null,
            })
          }
        />
        Recorrente
      </label>

      {value.enabled && (
        <RecurrenceControls
          interval={interval}
          unit={unit}
          setInterval={setInterval}
          setUnit={setUnit}
          mode={mode}
          setMode={setMode}
          count={count}
          setCount={setCount}
          until={until}
          setUntil={setUntil}
        />
      )}

      {value.enabled && baseDate && (
        <RecurrencePreview
          loading={loading}
          preview={preview}
          error={error}
        />
      )}

    </div>
  );
}