"use client";

import { useState } from "react";
import { useAnimalWeightFeeding } from "@/hooks/useAnimalWeightFeeding";

type Props = {
  animalId: string;
};

export function WeightFeedingHistory({ animalId }: Props) {
  const { records, loading, create, remove } =
    useAnimalWeightFeeding(animalId);

  const [form, setForm] = useState({
    recorded_at: "",
    weight_kg: "",
    food_type: "",
    food_brand: "",
    food_name: "",
    food_amount_grams: "",
    food_price: "",
    body_condition: "",
    notes: "",
  });

  async function handleCreate() {
    await create({
     recorded_at: new Date(form.recorded_at).toISOString(),
      weight_kg: form.weight_kg
        ? Number(form.weight_kg)
        : undefined,
      food_type: form.food_type || undefined,
      food_brand: form.food_brand || undefined,
      food_name: form.food_name || undefined,
      food_amount_grams: form.food_amount_grams
        ? Number(form.food_amount_grams)
        : undefined,
      food_price: form.food_price
        ? Number(form.food_price)
        : undefined,
      body_condition: form.body_condition || undefined,
      notes: form.notes || undefined,
    });

    setForm({
      recorded_at: "",
      weight_kg: "",
      food_type: "",
      food_brand: "",
      food_name: "",
      food_amount_grams: "",
      food_price: "",
      body_condition: "",
      notes: "",
    });
  }

  if (loading) {
    return <div className="text-sm text-zinc-500">Carregando…</div>;
  }

  return (
    <div className="space-y-8">

      <div className="space-y-3 border rounded p-4">
        <h3 className="font-semibold text-sm">
          Registrar peso / alimentação
        </h3>

        <input
          type="datetime-local"
          value={form.recorded_at}
          onChange={(e) =>
            setForm({ ...form, recorded_at: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Peso (kg)"
          value={form.weight_kg}
          onChange={(e) =>
            setForm({ ...form, weight_kg: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Tipo de alimento"
          value={form.food_type}
          onChange={(e) =>
            setForm({ ...form, food_type: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Marca"
          value={form.food_brand}
          onChange={(e) =>
            setForm({ ...form, food_brand: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Nome da ração / dieta"
          value={form.food_name}
          onChange={(e) =>
            setForm({ ...form, food_name: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Quantidade diária (g)"
          value={form.food_amount_grams}
          onChange={(e) =>
            setForm({
              ...form,
              food_amount_grams: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Preço"
          value={form.food_price}
          onChange={(e) =>
            setForm({ ...form, food_price: e.target.value })
          }
          className="border p-2 w-full"
        />

        <input
          placeholder="Condição corporal"
          value={form.body_condition}
          onChange={(e) =>
            setForm({
              ...form,
              body_condition: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Observações"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
          className="border p-2 w-full"
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Registrar
        </button>
      </div>

      <div className="space-y-3">
        {records.map((r) => (
          <div
            key={r.public_id}
            className="border rounded p-4 flex justify-between"
          >
            <div className="space-y-1 text-sm">

              <div>
                <strong>Data:</strong>{" "}
                {new Date(r.recorded_at).toLocaleString()}
              </div>

             {r.weight_value !== null && r.weight_value !== undefined && (
                <div>
                  <strong>Peso:</strong>{" "}
                  {r.weight_value} {r.weight_unit}
                </div>
              )}

              {r.food_type && (
                <div>
                  <strong>Alimento:</strong>{" "}
                  {r.food_type}
                </div>
              )}

              {r.food_brand && (
                <div>
                  <strong>Marca:</strong>{" "}
                  {r.food_brand}
                </div>
              )}

              {r.food_name && (
                <div>
                  <strong>Dieta:</strong>{" "}
                  {r.food_name}
                </div>
              )}

              {r.daily_quantity_value && (
                <div>
                  <strong>Quantidade:</strong>{" "}
                  {r.daily_quantity_value}{" "}
                  {r.daily_quantity_unit}
                </div>
              )}

              {r.notes && (
                <div>
                  <strong>Obs:</strong> {r.notes}
                </div>
              )}
            </div>

            <button
              onClick={() => remove(r.public_id)}
              className="text-red-600 text-sm"
            >
              remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

