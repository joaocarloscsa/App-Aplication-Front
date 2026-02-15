"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimalMedicationForm } from "@/components/animals/clinic/AnimalMedicationForm";
import {
  getAnimalMedications,
  deleteAnimalMedication,
  AnimalMedicationItem,
} from "@/services/animalMedications";

export default function AnimalClinicMedicationsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<AnimalMedicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<AnimalMedicationItem | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function reload() {
    if (!animalId) return;
    const res = await getAnimalMedications(animalId);
    setItems(res.items);
  }

  useEffect(() => {
    reload()
      .catch(() => setError("Erro ao carregar medicações."))
      .finally(() => setLoading(false));
  }, [animalId]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando medicações…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {/* TOPO */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-zinc-900">
          Medicações
        </h2>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="text-sm font-medium text-zinc-700 hover:underline"
        >
          + Registrar medicação
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <AnimalMedicationForm
          animalId={animalId}
          initialData={editingItem ?? undefined}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSaved={async () => {
            setShowForm(false);
            setEditingItem(null);
            await reload();
          }}
        />
      )}

      {/* LISTA */}
      {items.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhuma medicação registrada para este animal.
        </p>
      )}

      {items.map((item) => {
        const expanded = expandedId === item.id;
        const canEdit = item.user_can_edit;

        return (
          <div
            key={item.id}
            className="rounded-lg border bg-white px-4 py-3 space-y-2"
          >
            {/* RESUMO */}
            <button
              type="button"
              onClick={() =>
                setExpandedId(expanded ? null : item.id)
              }
              className="w-full text-left flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-zinc-900">
                  {item.medication.label}
                  {item.commercial_name && (
                    <span className="text-sm text-zinc-600">
                      {" "}
                      — {item.commercial_name}
                    </span>
                  )}
                </p>

                <p className="text-xs text-zinc-500">
                  Aplicado em{" "}
                  {new Date(item.applied_at).toLocaleString()}
                </p>
              </div>

              <span className="text-zinc-400 text-sm">
                {expanded ? "▲" : "▼"}
              </span>
            </button>

            {/* DETALHES */}
            {expanded && (
              <div className="pt-2 border-t space-y-2 text-sm text-zinc-700">
                {item.manufacturer && (
                  <div>
                    <strong>Fabricante:</strong>{" "}
                    {item.manufacturer}
                  </div>
                )}

                {item.dosage && (
                  <div>
                    <strong>Dosagem:</strong> {item.dosage}
                  </div>
                )}

                {item.notes && (
                  <div>
                    <strong>Observações:</strong> {item.notes}
                  </div>
                )}

                {item.recorded_by && (
                  <div className="text-xs text-zinc-500 pt-1">
                    Registrado por{" "}
                    <span className="font-medium">
                      {item.recorded_by.name}
                    </span>
                  </div>
                )}

                {canEdit && (
                  <div className="flex gap-4 pt-3 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const ok = confirm(
                          "Tem certeza que deseja excluir este registro?"
                        );
                        if (!ok) return;

                        await deleteAnimalMedication(
                          animalId,
                          item.id
                        );
                        await reload();
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
