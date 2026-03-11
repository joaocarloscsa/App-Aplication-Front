"use client";

import { RecurrenceMode, RecurrenceUnit } from "../RecurrenceBuilder";

type Props = {
  interval: number;
  unit: RecurrenceUnit;
  setInterval(v: number): void;
  setUnit(v: RecurrenceUnit): void;

  mode: RecurrenceMode;
  setMode(v: RecurrenceMode): void;

  count: number;
  setCount(v: number): void;

  until: string;
  setUntil(v: string): void;
};

export function RecurrenceControls({
  interval,
  unit,
  setInterval,
  setUnit,
  mode,
  setMode,
  count,
  setCount,
  until,
  setUntil,
}: Props) {
  return (
    <div className="space-y-2">

      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          min={1}
          value={interval}
          onChange={(e) =>
            setInterval(Number(e.target.value))
          }
          className="rounded-md border px-2 py-1 text-sm"
        />

        <select
          value={unit}
          onChange={(e) =>
            setUnit(e.target.value as RecurrenceUnit)
          }
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="day">Dia(s)</option>
          <option value="month">Mês(es)</option>
        </select>

        <select
          value={mode}
          onChange={(e) =>
            setMode(e.target.value as RecurrenceMode)
          }
          className="rounded-md border px-2 py-1 text-sm"
        >
          <option value="COUNT">Nº repetições</option>
          <option value="UNTIL">Data final</option>
        </select>
      </div>

      {mode === "COUNT" ? (
        <input
          type="number"
          min={1}
          max={365}
          value={count}
          onChange={(e) =>
            setCount(Number(e.target.value))
          }
          className="rounded-md border px-2 py-1 text-sm w-32"
        />
      ) : (
        <input
          type="date"
          value={until}
          onChange={(e) =>
            setUntil(e.target.value)
          }
          className="rounded-md border px-2 py-1 text-sm"
        />
      )}

    </div>
  );
}