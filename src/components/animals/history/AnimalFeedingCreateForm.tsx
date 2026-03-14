"use client";

import { useState } from "react";
import { createAnimalFeedingRecord } from "@/services/animalWeightFeeding";
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

export function AnimalFeedingCreateForm({ animalId, onCreated }: Props) {

  const { confirm } = useModal();

  const [foodType, setFoodType] = useState("");
  const [foodBrand, setFoodBrand] = useState("");
  const [foodName, setFoodName] = useState("");

  const [mealsPerDay, setMealsPerDay] = useState("2");
  const [portionValue, setPortionValue] = useState("");
  const [portionUnit, setPortionUnit] = useState("g");

  const [description, setDescription] = useState("");

  const [recordedAt, setRecordedAt] = useState(nowLocalDatetime());

  const [saving, setSaving] = useState(false);

  function numericOnly(value: string) {
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return false;
    return true;
  }

  function totalDaily() {

    const meals = Number(mealsPerDay);
    const portion = Number(portionValue);

    if (!meals || !portion) return 0;

    return meals * portion;
  }

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {

      await createAnimalFeedingRecord(animalId, {

        recorded_at: new Date(recordedAt).toISOString(),

        food_type: foodType || undefined,
        food_brand: foodBrand || undefined,
        food_name: foodName || undefined,

        meals_per_day: Number(mealsPerDay),
        portion_value: Number(portionValue),
        portion_unit: portionUnit,

        description: description || undefined

      });

      setPortionValue("");
      setDescription("");

      await onCreated();

      await confirm({
        title: "Alimentação registrada",
        message: "O regime alimentar foi salvo.",
        confirmLabel: "OK",
        hideCancel: true,
      });

    } catch {

      await confirm({
        title: "Erro",
        message: "Não foi possível salvar.",
        variant: "danger",
        confirmLabel: "OK",
        hideCancel: true,
      });

    } finally {

      setSaving(false);

    }
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 bg-white space-y-4"
    >

      <div className="grid grid-cols-2 gap-3">

        <input
          type="text"
          placeholder="Tipo de alimentação"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />

        <input
          type="text"
          placeholder="Marca"
          value={foodBrand}
          onChange={(e) => setFoodBrand(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />

      </div>

      <input
        type="text"
        placeholder="Nome da dieta"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-full"
      />

      <div className="grid grid-cols-3 gap-3">

        <input
          type="text"
          placeholder="Refeições por dia"
          value={mealsPerDay}
          onChange={(e) => {

            if (!numericOnly(e.target.value)) return;

            setMealsPerDay(e.target.value);

          }}
          className="border rounded px-2 py-1 text-sm"
        />

        <input
          type="text"
          placeholder="Peso por refeição"
          value={portionValue}
          onChange={(e) => {

            if (!numericOnly(e.target.value)) return;

            setPortionValue(e.target.value);

          }}
          className="border rounded px-2 py-1 text-sm"
        />

        <select
          value={portionUnit}
          onChange={(e) => setPortionUnit(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="g">g</option>
          <option value="kg">kg</option>
        </select>

      </div>

      <div className="text-sm text-zinc-600">

        Total diário: <strong>{totalDaily()} {portionUnit}</strong>

      </div>

      <textarea
        placeholder="Descrição detalhada da dieta"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-full h-24"
      />

      <input
        type="datetime-local"
        value={recordedAt}
        onChange={(e) => setRecordedAt(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      />

      <button
        type="submit"
        disabled={saving}
        className="text-sm font-medium text-zinc-900 hover:underline"
      >
        {saving ? "Salvando…" : "+ Registrar alimentação"}
      </button>

    </form>

  );

}
