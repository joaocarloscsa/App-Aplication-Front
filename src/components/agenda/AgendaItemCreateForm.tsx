// path: frontend/src/components/agenda/AgendaItemCreateForm.tsx

"use client";

import { useState } from "react";

export type RecurrenceUnit = "day" | "week" | "month" | "year";

export type RecurrenceRule = {
  interval: number;        // ex: 1, 2, 3
  unit: RecurrenceUnit;    // day | week | month | year
  until?: string | null;   // ISO date
};

type Props = {
  onSubmit(data: {
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string | null;
    priority: number | null;
    recurrence: RecurrenceRule | null;
  }): Promise<void>;
};

export function AgendaItemCreateForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [priority, setPriority] = useState<number | null>(null);

  const [isRecurring, setIsRecurring] = useState(false);
  const [interval, setInterval] = useState(1);
  const [unit, setUnit] = useState<RecurrenceUnit>("day");
  const [until, setUntil] = useState("");

  async function handleSubmit() {
    if (!title || !startsAt) return;

    await onSubmit({
      title,
      description: description || null,
      starts_at: startsAt,
      ends_at: endsAt || null,
      priority,
      recurrence: isRecurring
        ? {
            interval,
            unit,
            until: until || null,
          }
        : null,
    });

    setTitle("");
    setDescription("");
    setStartsAt("");
    setEndsAt("");
    setPriority(null);
    setIsRecurring(false);
  }

  return (
    <div className="space-y-4 rounded-md border bg-white p-4">
      <h3 className="text-sm font-semibold text-zinc-900">
        Nova tarefa / evento
      </h3>

      <input
        className="w-full rounded-md border px-3 py-2 text-sm"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full rounded-md border px-3 py-2 text-sm"
        placeholder="Observações"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="datetime-local"
          className="rounded-md border px-3 py-2 text-sm"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />

        <input
          type="datetime-local"
          className="rounded-md border px-3 py-2 text-sm"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
        />
      </div>

      <select
        className="w-full rounded-md border px-3 py-2 text-sm"
        value={priority ?? ""}
        onChange={(e) =>
          setPriority(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">Sem prioridade</option>
        <option value="3">Baixa</option>
        <option value="5">Média</option>
        <option value="9">Alta</option>
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
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            min={1}
            className="rounded-md border px-2 py-1 text-sm"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
          />

          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={unit}
            onChange={(e) => setUnit(e.target.value as RecurrenceUnit)}
          >
            <option value="day">Dia(s)</option>
            <option value="week">Semana(s)</option>
            <option value="month">Mês(es)</option>
            <option value="year">Ano(s)</option>
          </select>

          <input
            type="date"
            className="rounded-md border px-2 py-1 text-sm"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
      >
        Criar
      </button>
    </div>
  );
}

