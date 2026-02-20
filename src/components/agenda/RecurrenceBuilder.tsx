// path: frontend/src/components/agenda/RecurrenceBuilder.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/services/api";

export type RecurrenceUnit = "day" | "month";
export type RecurrenceMode = "COUNT" | "UNTIL";

export type RecurrenceValue = {
  interval: number;
  unit: RecurrenceUnit;
  until: string | null;
};

export type RecurrenceOutput = {
  enabled: boolean;
  recurrence: RecurrenceValue | null;
};

type RecurrencePreview = {
  summary: string;
  next_dates: string[];
  total: number | null;
};

type Props = {
  animalId?: string; // ⬅️ agora opcional
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

  const [preview, setPreview] = useState<RecurrencePreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  function buildScheduledAtIso(): string | null {
    if (!baseDate) return null;

    const hhmm = baseTime?.trim() ? baseTime.trim() : "00:00";
    const local = new Date(`${baseDate}T${hhmm}:00`);

    if (Number.isNaN(local.getTime())) return null;

    return local.toISOString();
  }

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

  function emitChange(untilValue: string | null) {
  onChange({
    enabled: true,
    recurrence: {
      interval,
      unit,
      until: untilValue,
    },
  });
}


  // 🔁 Preview
useEffect(() => {
  if (!value.enabled || !baseDate || !animalId) {
    setPreview(null);
    return;
  }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    setPreviewError(null);

    debounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      async function loadPreview() {
        try {
          setPreviewLoading(true);

          const scheduledAtIso = buildScheduledAtIso();
          if (!scheduledAtIso) {
            setPreviewError("Data/hora inválida.");
            return;
          }

          let untilPayload: string | null = null;

          if (mode === "UNTIL") {
            if (until && new Date(until) < new Date(baseDate)) {
              setPreviewError(
                "A data final deve ser posterior à data inicial."
              );
              return;
            }
            untilPayload = until || null;
          } else {
            if (count < 1 || count > MAX_COUNT) {
              setPreviewError("Número de repetições inválido.");
              return;
            }
            untilPayload = computeUntilFromCount();
          }

          const res = await apiFetch(
            `/api/v1/animals/${animalId}/tasks/preview`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                scheduled_at: scheduledAtIso,
                recurrence: {
                  interval,
                  unit,
                  until: untilPayload,
                },
              }),
              signal: controller.signal,
            } as RequestInit
          );

          if (mode === "COUNT") {
            setPreview({
              summary:
                count === 1
                  ? "Será criada uma única ocorrência."
                  : `Serão criadas ${count} ocorrências.`,
              next_dates: Array.isArray(res.next_dates)
                ? res.next_dates.slice(0, 3)
                : [],
              total: count,
            });
          } else {
            setPreview(res);
          }

          setPreviewError(null);

          onChange({
            enabled: true,
            recurrence: {
              interval,
              unit,
              until: untilPayload,
            },
          });
        } catch (e: any) {
          if (e?.name === "AbortError") return;
          setPreviewError("Não foi possível gerar o preview.");
        } finally {
          setPreviewLoading(false);
        }
      }

      loadPreview();
    }, 250);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [
    value.enabled,
    baseDate,
    baseTime,
    interval,
    unit,
    mode,
    count,
    until,
    animalId,
  ]);

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
                ? { interval, unit, until: null }
                : null,
            })
          }
        />
        Recorrente
      </label>

      {value.enabled && (
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
              max={MAX_COUNT}
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
              onChange={(e) => setUntil(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            />
          )}
        </div>
      )}

      {value.enabled && baseDate && (
        <div className="text-xs bg-zinc-50 border rounded px-3 py-2 min-h-[72px]">
          {previewLoading && (
            <p className="text-zinc-500">Gerando preview…</p>
          )}

          {!previewLoading && preview && (
            <>
              <p className="font-medium">{preview.summary}</p>
              <ul className="list-disc pl-4">
                {preview.next_dates.map((d) => (
                  <li key={d}>
                    {new Date(d).toLocaleDateString()}
                  </li>
                ))}
              </ul>
              {preview.total !== null && (
                <p className="text-zinc-500">
                  Total: {preview.total}
                </p>
              )}
            </>
          )}

          {!previewLoading && previewError && (
            <p className="text-red-600">{previewError}</p>
          )}
        </div>
      )}
    </div>
  );
}
