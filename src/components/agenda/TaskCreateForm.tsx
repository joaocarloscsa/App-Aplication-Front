// /var/www/GSA/animal/frontend/src/components/agenda/TaskCreateForm.tsx

"use client";

import { useState } from "react";
import { createAnimalTask } from "@/services/animalTasks";
import { RecurrenceBuilder } from "@/components/agenda/RecurrenceBuilder";

import { RecurrenceOutput } from "@/components/agenda/RecurrenceBuilder";

type Props = {
  animalId: string;
  onCreated(): void;
};

export function TaskCreateForm({ animalId, onCreated }: Props) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<1 | 2 | 3>(2);

  const [recurrence, setRecurrence] = useState<RecurrenceOutput>({
    enabled: false,
    recurrence: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function buildLocalScheduledAtIso(): string | null {
    if (!date) return null;

    const hhmm = time?.trim() ? time.trim() : "00:00";
    const local = new Date(`${date}T${hhmm}:00`);

    if (Number.isNaN(local.getTime())) return null;

    return local.toISOString();
  }

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

    const scheduledAtIso = buildLocalScheduledAtIso();
    if (!scheduledAtIso) {
      setError("Data/hora inválida.");
      return;
    }

    try {
      setLoading(true);

      await createAnimalTask(animalId, {
        title,
        description: description.trim() || null,
        scheduled_at: scheduledAtIso,
        priority,
        recurrence: recurrence.enabled
          ? recurrence.recurrence
          : null,
      });

      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setPriority(2);
      setRecurrence({ enabled: false, recurrence: null });

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
    <div className="space-y-3 rounded-md border bg-white p-4">
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

      <RecurrenceBuilder
        animalId={animalId}
        baseDate={date}
        baseTime={time}
        value={recurrence}
        onChange={setRecurrence}
      />

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