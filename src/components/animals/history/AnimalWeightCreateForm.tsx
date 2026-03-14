"use client";

import { useState } from "react";
import { createAnimalWeightRecord } from "@/services/animalWeight";
import { useModal } from "@/components/ui/modal/ModalProvider";

type Props = {
  animalId: string;
  onCreated: () => Promise<void>;
};

function nowLocalDatetime() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
}

export function AnimalWeightCreateForm({ animalId, onCreated }: Props) {

  const { confirm } = useModal();

  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [recordedAt, setRecordedAt] = useState(nowLocalDatetime());
  const [saving, setSaving] = useState(false);

  function handleWeightChange(value: string) {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;
    setWeightValue(value);
  }

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!weightValue || saving) return;

    setSaving(true);

    try {

      await createAnimalWeightRecord(animalId, {
        weight_value: Number(weightValue),
        weight_unit: weightUnit,
        recorded_at: new Date(recordedAt).toISOString(),
      });

      // limpa formulário
      setWeightValue("");
      setRecordedAt(nowLocalDatetime());

      // refresh suave
      await onCreated();

      // feedback ao usuário
      await confirm({
        title: "Peso registrado",
        message: "O peso foi salvo com sucesso.",
        confirmLabel: "OK",
        hideCancel: true,
      });

    } catch (err) {

      await confirm({
        title: "Erro",
        message: "Não foi possível registrar o peso.",
        confirmLabel: "OK",
        hideCancel: true,
        variant: "danger",
      });

    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 bg-white space-y-3"
    >

      <div className="flex gap-2">

        <input
          type="text"
          inputMode="decimal"
          placeholder="Peso"
          value={weightValue}
          onChange={(e) => handleWeightChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-32"
          required
        />

        <select
          value={weightUnit}
          onChange={(e) =>
            setWeightUnit(e.target.value as "kg" | "g")
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
        </select>

      </div>

      <input
        type="datetime-local"
        value={recordedAt}
        onChange={(e) => setRecordedAt(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
        required
      />

      <button
        type="submit"
        disabled={saving}
        className="text-sm font-medium text-zinc-900 hover:underline disabled:opacity-50"
      >
        {saving ? "Salvando…" : "+ Registrar peso"}
      </button>

    </form>
  );
}
