"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAnimalVaccinations } from "@/hooks/useAnimalVaccinations";
import { VaccinationCreateForm } from "@/components/animals/clinic/vaccinations/VaccinationCreateForm";

export default function AnimalClinicVaccinationsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const { vaccinations, loading, error, reload } =
    useAnimalVaccinations(animalId);

  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando vacinas…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">
          Vacinação
        </h2>

        <button
          onClick={() => setShowCreate(true)}
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          + Nova vacinação
        </button>
      </div>

      {showCreate && (
        <VaccinationCreateForm
          animalPublicId={animalId}
          onCancel={() => setShowCreate(false)}
          onCreated={async () => {
            await reload();
            setShowCreate(false);
          }}
        />
      )}

      {vaccinations.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhuma vacina registrada.
        </p>
      )}

      {vaccinations.map((v) => {

        const lastDose =
          v.doses?.find((d) => d.applied_at) ??
          v.doses?.[0];

        const isOpen = expanded === v.vaccination_public_id;

        return (
          <div
            key={v.vaccination_public_id}
            className="border rounded-lg p-4 bg-white space-y-3"
          >

            {/* HEADER */}

            <div className="flex justify-between">

              <div>
                <p className="font-semibold text-zinc-900">
                  {v.vaccine_name}
                </p>

                <p className="text-xs text-zinc-500">
                  Fabricante: {v.manufacturer ?? "—"}
                </p>

                <p className="text-xs text-zinc-500">
                  Lote: {v.batch_number ?? "—"}
                </p>

                {v.expiration_date && (
                  <p className="text-xs text-zinc-500">
                    Validade:{" "}
                    {new Date(v.expiration_date).toLocaleDateString("pt-PT")}
                  </p>
                )}
              </div>

              <div className="text-right">

                <span className="text-xs text-zinc-500">
                  {v.status}
                </span>

                <button
                  onClick={() =>
                    setExpanded(
                      isOpen ? null : v.vaccination_public_id
                    )
                  }
                  className="block text-xs text-blue-600 hover:underline"
                >
                  {isOpen ? "ocultar" : "ver histórico"}
                </button>

              </div>

            </div>

            {/* RESUMO DA ÚLTIMA DOSE */}

            {lastDose && (

              <div className="text-xs text-zinc-700 space-y-1 border-t pt-2">

                {lastDose.applied_at && (
                  <p>
                    Aplicada em:{" "}
                    {new Date(lastDose.applied_at).toLocaleDateString("pt-PT")}
                  </p>
                )}

                {lastDose.actor && (
                  <p>
                    Aplicada por: {lastDose.actor.name}
                  </p>
                )}

                {lastDose.next_dose_at && (
                  <p className="text-amber-600">
                    Próxima dose:{" "}
                    {new Date(lastDose.next_dose_at).toLocaleDateString("pt-PT")}
                  </p>
                )}

                {lastDose.notes && (
                  <p>
                    Observação: {lastDose.notes}
                  </p>
                )}

              </div>

            )}

            {/* HISTÓRICO COMPLETO */}

            {isOpen && v.doses?.length > 0 && (

              <div className="space-y-2 border-t pt-3">

                {v.doses.map((dose) => (

                  <div
                    key={dose.public_id}
                    className="border rounded p-2 text-xs space-y-1"
                  >

                    <div className="flex justify-between">

                      <span className="font-medium">
                        Dose {dose.dose_number}
                      </span>

                      <span className="text-zinc-400">
                        {dose.status}
                      </span>

                    </div>

                    {dose.applied_at && (
                      <p>
                        Aplicada em:{" "}
                        {new Date(dose.applied_at).toLocaleDateString("pt-PT")}
                      </p>
                    )}

                    {dose.actor && (
                      <p>
                        Aplicada por: {dose.actor.name}
                      </p>
                    )}

                    {dose.next_dose_at && (
                      <p>
                        Próxima dose:{" "}
                        {new Date(dose.next_dose_at).toLocaleDateString("pt-PT")}
                      </p>
                    )}

                    {dose.notes && (
                      <p>
                        Observação: {dose.notes}
                      </p>
                    )}

                  </div>

                ))}

              </div>

            )}

          </div>
        );
      })}
    </div>
  );
}