"use client";

import { useState } from "react";
import {
  createTreatmentSchedule,
  CreateTreatmentSchedulePayload,
} from "@/services/treatmentSchedules";

type Props = {
  treatmentPublicId: string;
  onCreated(schedule: {
    schedule_public_id: string;
    frequency: string;
    dosage?: string | null;
    starts_at: string;
    ends_at?: string | null;
    status: string;
  }): void;
};

export function AnimalTreatmentScheduleCreateForm({
  treatmentPublicId,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [dosage, setDosage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    if (!startsAt) {
      setError("Data de início obrigatória.");
      return;
    }

    const payload: CreateTreatmentSchedulePayload = {
      frequency,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      dosage: dosage || null,
      generate_agenda: true,
    };

    try {
      setLoading(true);

      const res = await createTreatmentSchedule(
        treatmentPublicId,
        payload
      );

      onCreated({
        schedule_public_id: res.schedule_public_id,
        frequency,
        dosage: dosage || null,
        starts_at: payload.starts_at,
        ends_at: payload.ends_at,
        status: "active",
      });

      setOpen(false);
      setStartsAt("");
      setEndsAt("");
      setDosage("");
    } catch {
      setError("Erro ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-zinc-700 hover:underline"
      >
        + Adicionar agendamento
      </button>
    );
  }

  return (
    <div className="mt-2 rounded border bg-zinc-50 p-3 space-y-2">
      {error && <p className="text-xs text-red-600">{error}</p>}

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      >
        <option value="daily">Diário</option>
        <option value="weekly">Semanal</option>
        <option value="interval">Intervalo</option>
      </select>

      <input
        type="date"
        value={startsAt}
        onChange={(e) => setStartsAt(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      />

      <input
        type="date"
        value={endsAt}
        onChange={(e) => setEndsAt(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      />

      <input
        placeholder="Dosagem (opcional)"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-zinc-600"
        >
          Cancelar
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="text-xs rounded bg-zinc-900 px-3 py-1 text-white"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}