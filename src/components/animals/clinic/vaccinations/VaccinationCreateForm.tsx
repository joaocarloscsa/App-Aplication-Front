"use client";

import { useState } from "react";
import { createAnimalVaccination } from "@/services/animalVaccinations";

type Props = {
  animalPublicId: string;
  onCreated(): Promise<void> | void;
  onCancel(): void;
};

export function VaccinationCreateForm({
  animalPublicId,
  onCreated,
  onCancel,
}: Props) {

  const [vaccineName, setVaccineName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  const [expirationDate, setExpirationDate] = useState("");
  const [appliedAt, setAppliedAt] = useState("");
  const [nextDoseAt, setNextDoseAt] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [doseNumber, setDoseNumber] = useState(1);

  async function submit() {

    setError(null);

    if (!vaccineName.trim()) {
      setError("O nome da vacina é obrigatório.");
      return;
    }

    if (!appliedAt) {
      setError("A data da vacinação é obrigatória.");
      return;
    }

    try {

      setLoading(true);

      await createAnimalVaccination(animalPublicId, {
        vaccine_name: vaccineName,
        manufacturer: manufacturer || undefined,
        batch_number: batchNumber || undefined,
        expiration_date: expirationDate || undefined,
        dose_number: doseNumber, 
        applied_at: appliedAt
          ? new Date(appliedAt).toISOString()
          : undefined,
        next_dose_at: nextDoseAt
          ? new Date(nextDoseAt).toISOString()
          : undefined,
        notes: notes || undefined
      });

      await onCreated();

    } catch {

      setError("Erro ao registrar vacinação.");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-4">

      <h3 className="text-sm font-semibold">
        Registrar vacinação
      </h3>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      

      <div className="space-y-1">

        <label className="text-xs font-medium">
  Número da dose
</label>

<input
  type="number"
  min={1}
  className="w-full border rounded px-3 py-2 text-sm"
  value={doseNumber}
  onChange={(e) => setDoseNumber(Number(e.target.value))}
/>



        <label className="text-xs font-medium">
          Vacina
        </label>

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={vaccineName}
          onChange={(e) => setVaccineName(e.target.value)}
        />

      </div>

      <div className="space-y-1">

        <label className="text-xs font-medium">
          Fabricante
        </label>

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />

      </div>

      <div className="space-y-1">

        <label className="text-xs font-medium">
          Lote
        </label>

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
        />

      </div>

      <div className="space-y-1">

        <label className="text-xs font-medium">
          Validade da vacina
        </label>

        <input
          type="date"
          className="w-full border rounded px-3 py-2 text-sm"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />

      </div>

      <div className="space-y-1">

        <label className="text-xs font-medium">
          Data da vacinação
        </label>

        <input
          type="date"
          className="w-full border rounded px-3 py-2 text-sm"
          value={appliedAt}
          onChange={(e) => setAppliedAt(e.target.value)}
        />

      </div>

      <div className="space-y-1">

        <label className="text-xs font-medium">
          Próxima vacinação
        </label>

        <input
          type="date"
          className="w-full border rounded px-3 py-2 text-sm"
          value={nextDoseAt}
          onChange={(e) => setNextDoseAt(e.target.value)}
        />

      </div>

      <div className="space-y-1">

        <label className="text-xs font-medium">
          Observações clínicas
        </label>

        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

      </div>

      <div className="flex justify-end gap-2">

        <button
          onClick={onCancel}
          className="text-sm text-zinc-600"
        >
          Cancelar
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-zinc-900 text-white text-sm px-4 py-2 rounded"
        >
          Registrar
        </button>

      </div>

    </div>
  );
}