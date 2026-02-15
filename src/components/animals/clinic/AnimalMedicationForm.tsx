"use client";

import { useEffect, useState } from "react";
import {
  getMedicationCatalog,
  MedicationCatalogItem,
} from "@/services/medicationCatalog";
import {
  createAnimalMedication,
  updateAnimalMedication,
  AnimalMedicationItem,
} from "@/services/animalMedications";

type Props = {
  animalId: string;
  initialData?: AnimalMedicationItem;
  onSaved(): Promise<void>;
  onCancel(): void;
};

const HOURS = Array.from({ length: 24 }).map((_, h) =>
  `${String(h).padStart(2, "0")}:00`
);

export function AnimalMedicationForm({
  animalId,
  initialData,
  onSaved,
  onCancel,
}: Props) {
  const [catalog, setCatalog] = useState<MedicationCatalogItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [medicationId, setMedicationId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [dosage, setDosage] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ EFFECT 1 — SEMPRE carrega o catálogo
  useEffect(() => {
    getMedicationCatalog()
      .then((res) => setCatalog(res.items))
      .finally(() => setLoadingCatalog(false));
  }, []);

  // ✅ EFFECT 2 — SOMENTE se for edição
  useEffect(() => {
    if (!initialData) return;

    setMedicationId(initialData.medication.id);
    setDosage(initialData.dosage ?? "");
    setCommercialName(initialData.commercial_name ?? "");
    setManufacturer(initialData.manufacturer ?? "");
    setNotes(initialData.notes ?? "");

    const d = new Date(initialData.applied_at);
    setDate(d.toISOString().slice(0, 10));
    setHour(d.toTimeString().slice(0, 5));
  }, [initialData]);

  async function handleSubmit() {
    setError(null);

    if (!medicationId) {
      setError("Selecione a medicação.");
      return;
    }

    if (!date || !hour) {
      setError("Informe data e hora da aplicação.");
      return;
    }

    const appliedAt = new Date(`${date}T${hour}:00`).toISOString();

    try {
      setSubmitting(true);

      if (initialData) {
        await updateAnimalMedication(animalId, initialData.id, {
          applied_at: appliedAt,
          dosage: dosage || undefined,
          notes: notes || undefined,
          commercialName: commercialName || undefined,
          manufacturer: manufacturer || undefined,
        });
      } else {
        await createAnimalMedication(animalId, {
          medication_id: medicationId,
          applied_at: appliedAt,
          dosage: dosage || undefined,
          notes: notes || undefined,
          commercialName: commercialName || undefined,
          manufacturer: manufacturer || undefined,
        });
      }

      await onSaved();
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCatalog) {
    return (
      <p className="text-sm text-zinc-500">
        Carregando catálogo de medicações…
      </p>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-4">
      {error && (
        <div className="text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* MEDICAÇÃO */}
      <div>
        <label className="block text-xs font-medium text-zinc-600">
          Tipo de medicação
        </label>
        <select
          value={medicationId}
          onChange={(e) =>
            setMedicationId(
              e.target.value ? Number(e.target.value) : ""
            )
          }
          className="w-full rounded border px-3 py-2 text-sm"
          disabled={!!initialData}
        >
          <option value="">Selecione…</option>
          {catalog.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* NOME COMERCIAL */}
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Nome comercial"
        value={commercialName}
        onChange={(e) => setCommercialName(e.target.value)}
      />

      {/* FABRICANTE */}
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Fabricante"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
      />

      {/* DOSAGEM */}
      <input
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Dosagem"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
      />

      {/* DATA / HORA */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          className="rounded border px-3 py-2 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="rounded border px-3 py-2 text-sm"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        >
          <option value="">Hora…</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* OBS */}
      <textarea
        className="w-full rounded border px-3 py-2 text-sm"
        placeholder="Observações"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="text-sm">
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white"
        >
          {initialData ? "Salvar alterações" : "Salvar"}
        </button>
      </div>
    </div>
  );
}
