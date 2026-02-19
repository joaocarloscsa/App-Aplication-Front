// path: frontend/src/components/agenda/TaskCreateForm.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { createAnimalTask } from "@/services/animalTasks";
import { apiFetch } from "@/services/api";

type Props = {
  animalId: string;
  onCreated(): void;
};

type RecurrenceUnit = "day" | "month";
type RecurrenceMode = "COUNT" | "UNTIL";

type RecurrencePreview = {
  summary: string;
  next_dates: string[];
  total: number | null;
};

const MAX_COUNT = 365;

export function TaskCreateForm({ animalId, onCreated }: Props) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);

  const [isRecurring, setIsRecurring] = useState(false);
  const [interval, setInterval] = useState(1);
  const [unit, setUnit] = useState<RecurrenceUnit>("day");

  const [recurrenceMode, setRecurrenceMode] =
    useState<RecurrenceMode>("COUNT");
  const [count, setCount] = useState(5);
  const [until, setUntil] = useState("");

  const [preview, setPreview] = useState<RecurrencePreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  function buildLocalScheduledAtIso(date: string, time: string): string | null {
  if (!date) return null;

  const hhmm = time?.trim() ? time.trim() : "00:00";
  const local = new Date(`${date}T${hhmm}:00`);

  if (Number.isNaN(local.getTime())) return null;

  // ✅ envia SEMPRE ISO UTC com Z (evita cair no dia anterior no backend)
  return local.toISOString();
}



  useEffect(() => {
    if (!isRecurring || !date) {
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

      const scheduledAtIso = buildLocalScheduledAtIso(date, time);
      if (!scheduledAtIso) {
        setPreviewError("Data/hora inválida.");
        return;
      }

          let untilPayload: string | null = null;

          if (recurrenceMode === "UNTIL") {
            untilPayload = until || null;
            if (until && new Date(until) < new Date(date)) {
              setPreviewError(
                "A data final deve ser posterior à data inicial."
              );
              return;
            }
          } else {
            if (count < 1 || count > MAX_COUNT) {
              setPreviewError("Número de repetições inválido.");
              return;
            }

            const base = new Date(`${date}T00:00:00`);
            const steps = (count - 1) * Math.max(1, interval);

            if (unit === "day") base.setDate(base.getDate() + steps);
            else base.setMonth(base.getMonth() + steps);

            const yyyy = base.getFullYear();
            const mm = String(base.getMonth() + 1).padStart(2, "0");
            const dd = String(base.getDate()).padStart(2, "0");
            untilPayload = `${yyyy}-${mm}-${dd}`;
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

          if (recurrenceMode === "COUNT") {
            setPreview({
              summary:
                count === 1
                  ? "Esta tarefa será criada uma única vez."
                  : `Esta tarefa será criada ${count} vezes.`,
              next_dates: Array.isArray(res.next_dates)
                ? res.next_dates.slice(0, 3)
                : [],
              total: count,
            });
          } else {
            setPreview(res);
          }

          setPreviewError(null);
        } catch (e: any) {
          if (e?.name === "AbortError") return;
          setPreviewError(
            "Não foi possível gerar o preview da recorrência."
          );
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
    isRecurring,
    date,
    time,
    interval,
    unit,
    recurrenceMode,
    count,
    until,
    animalId,
  ]);

  async function submit() {
    setError(null);

    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    if (!date) {
      setError("A data inicial é obrigatória.");
      return;
    }

    const scheduledAtIso = buildLocalScheduledAtIso(date, time);
if (!scheduledAtIso) {
  setError("Data/hora inválida.");
  return;
}

    let untilPayload: string | null = null;

    if (isRecurring) {
      if (recurrenceMode === "UNTIL") {
        if (until && new Date(until) < new Date(date)) {
          setError(
            "A data final deve ser posterior à data inicial."
          );
          return;
        }
        untilPayload = until || null;
      } else {
        if (count < 1 || count > MAX_COUNT) {
          setError("Número de repetições inválido.");
          return;
        }

        const base = new Date(`${date}T00:00:00`);
        const steps = (count - 1) * Math.max(1, interval);

        if (unit === "day") base.setDate(base.getDate() + steps);
        else base.setMonth(base.getMonth() + steps);

        const yyyy = base.getFullYear();
        const mm = String(base.getMonth() + 1).padStart(2, "0");
        const dd = String(base.getDate()).padStart(2, "0");
        untilPayload = `${yyyy}-${mm}-${dd}`;
      }
    }

    try {
      setLoading(true);

      await createAnimalTask(animalId, {
        title,
        description: description.trim() || null,
        scheduled_at: scheduledAtIso,
        priority,
        recurrence: isRecurring
          ? { interval, unit, until: untilPayload }
          : null,
      });

      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setPriority(2);

      setIsRecurring(false);
      setInterval(1);
      setUnit("day");
      setRecurrenceMode("COUNT");
      setCount(5);
      setUntil("");

      setPreview(null);
      setPreviewError(null);
      setOpen(false);

      onCreated();
    } catch {
      setError("Erro ao criar a tarefa. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-md border border-dashed px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50"
      >
        ➕ Nova tarefa
      </button>
    );
  }

  return (
    <div className="rounded-md border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-900">
          Nova tarefa
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-zinc-500 hover:underline"
        >
          Cancelar
        </button>
      </div>

      <input
        type="text"
        placeholder="Título da tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <textarea
        placeholder="Descrição / contexto (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm"
        rows={3}
      />

      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <select
        value={priority}
        onChange={(e) =>
          setPriority(Number(e.target.value) as 1 | 2 | 3)
        }
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value={1}>Alta</option>
        <option value={2}>Normal</option>
        <option value={3}>Baixa</option>
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        Tarefa recorrente
      </label>

      {isRecurring && (
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
              value={recurrenceMode}
              onChange={(e) =>
                setRecurrenceMode(
                  e.target.value as RecurrenceMode
                )
              }
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="COUNT">
                Número de repetições
              </option>
              <option value="UNTIL">Data final</option>
            </select>
          </div>

          {recurrenceMode === "COUNT" ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={MAX_COUNT}
                value={count}
                onChange={(e) =>
                  setCount(Number(e.target.value))
                }
                className="rounded-md border px-2 py-1 text-sm w-28"
              />
              <span className="text-xs text-zinc-500">
                Limite: {MAX_COUNT}
              </span>
            </div>
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

      {isRecurring && date && (
        <div className="text-xs bg-zinc-50 border rounded px-3 py-2 space-y-1 min-h-[72px]">
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
                  Total de ocorrências: {preview.total}
                </p>
              )}
            </>
          )}

          {!previewLoading && previewError && (
            <p className="text-red-600">{previewError}</p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-600 hover:underline"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Criar
        </button>
      </div>
    </div>
  );
}
