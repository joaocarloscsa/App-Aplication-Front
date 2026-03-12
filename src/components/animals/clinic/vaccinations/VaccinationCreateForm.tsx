"use client";

import { useState } from "react";
import { createAnimalVaccination } from "@/services/animalVaccinations";
import { useVaccineCatalog } from "@/hooks/useVaccineCatalog";

type Props = {
  animalPublicId: string;
  animalType: string;
  onCreated(): Promise<void> | void;
  onCancel(): void;
};

export function VaccinationCreateForm({
  animalPublicId,
  animalType,
  onCreated,
  onCancel,
}: Props) {

  const { vaccines } = useVaccineCatalog(animalType);

  const today = new Date().toISOString().slice(0,10);

  const [vaccineCode, setVaccineCode] = useState("");
  const [vaccinationType, setVaccinationType] = useState<
  "initial" | "booster" | "annual"
>("initial");
  const [doseNumber, setDoseNumber] = useState(1);

  const [manufacturer, setManufacturer] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const [appliedAt, setAppliedAt] = useState(today);
  const [nextDoseAt, setNextDoseAt] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {

    if (!vaccineCode) {
      setError("Selecione uma vacina.");
      return;
    }

    try {

      setLoading(true);

      await createAnimalVaccination(animalPublicId, {

        vaccine_name: vaccineCode,
        vaccination_type: vaccinationType,

        dose_number:
          vaccinationType === "initial"
            ? doseNumber
            : undefined,

        manufacturer: manufacturer || undefined,
        batch_number: batchNumber || undefined,
        expiration_date: expirationDate || undefined,

        applied_at: new Date(appliedAt).toISOString(),

        next_dose_at: nextDoseAt
          ? new Date(nextDoseAt).toISOString()
          : undefined,

        notes: notes || undefined

      });

      await onCreated();

    } catch {

      setError("Erro ao registrar vacinação");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="border rounded-lg p-4 bg-white space-y-4">

      <h3 className="text-sm font-semibold">
        Registrar vacinação
      </h3>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {/* VACINA */}

      <div>

        <label className="text-xs font-medium">
          Vacina
        </label>

        <select
          value={vaccineCode}
          onChange={(e) => setVaccineCode(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >

          <option value="">
            Selecionar vacina
          </option>

          {vaccines.map((v) => (

            <option key={v.code} value={v.code}>
              {v.name}
            </option>

          ))}

        </select>

      </div>

      {/* TIPO */}

      <div>

        <label className="text-xs font-medium">
          Tipo
        </label>

        <select
          value={vaccinationType}
          onChange={(e) =>
  setVaccinationType(
    e.target.value as "initial" | "booster" | "annual"
  )
}
          className="w-full border rounded px-3 py-2 text-sm"
        >

          <option value="initial">
            Série inicial
          </option>

          <option value="booster">
            Reforço
          </option>

          <option value="annual">
            Revacinação anual
          </option>

        </select>

      </div>

      {/* DOSE */}

      {vaccinationType === "initial" && (

        <div>

          <label className="text-xs font-medium">
            Número da dose
          </label>

          <input
            type="number"
            min={1}
            value={doseNumber}
            onChange={(e) =>
              setDoseNumber(Number(e.target.value))
            }
            className="w-full border rounded px-3 py-2 text-sm"
          />

        </div>

      )}

      {/* FABRICANTE */}

      <div>

        <label className="text-xs font-medium">
          Fabricante
        </label>

        <input
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

      </div>

      {/* LOTE */}

      <div>

        <label className="text-xs font-medium">
          Lote
        </label>

        <input
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

      </div>

      {/* VALIDADE */}

      <div>

        <label className="text-xs font-medium">
          Validade
        </label>

        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

      </div>

      {/* DATA */}

      <div>

        <label className="text-xs font-medium">
          Data da vacinação
        </label>

        <input
          type="date"
          value={appliedAt}
          onChange={(e) => setAppliedAt(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

      </div>

      {/* PRÓXIMA */}

      <div>

        <label className="text-xs font-medium">
          Próxima dose
        </label>

        <input
          type="date"
          value={nextDoseAt}
          onChange={(e) => setNextDoseAt(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

      </div>

      {/* OBS */}

      <div>

        <label className="text-xs font-medium">
          Observações
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
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