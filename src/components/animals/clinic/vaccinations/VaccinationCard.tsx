// path: frontend/src/components/animals/clinic/vaccinations/VaccinationCard.tsx

"use client";

import { VaccinationDTO, applyVaccinationDose, cancelVaccinationProtocol } from "@/services/animalVaccinations";
import { useModal } from "@/components/ui/modal/ModalProvider";

type Props = {
  vaccination: VaccinationDTO;
  onDoseApplied?(doseId: string): void;
  onCancelled?(vaccinationId: string): void;
};

function statusBadge(status: string) {
  const s = status.toLowerCase();

  if (s === "applied")
    return "bg-green-100 text-green-700";

  if (s === "scheduled")
    return "bg-blue-100 text-blue-700";

  if (s === "cancelled")
    return "bg-red-100 text-red-700";

  return "bg-zinc-100 text-zinc-600";
}

export function VaccinationCard({
  vaccination,
  onDoseApplied,
  onCancelled,
}: Props) {

  const { confirm, prompt } = useModal();

  async function handleApplyDose(doseId: string) {

    const comment = await prompt({
      title: "Aplicar dose",
      label: "Comentário do veterinário (opcional)",
      confirmLabel: "Aplicar",
    });

    if (comment === null) return;

    await applyVaccinationDose(doseId, {
      applied_at: new Date().toISOString(),
      comment,
    });

    onDoseApplied?.(doseId);
  }

  async function handleCancelProtocol() {

    const ok = await confirm({
      title: "Cancelar vacinação",
      message: "As próximas doses serão canceladas e o evento ficará registrado no histórico.",
      variant: "danger",
    });

    if (!ok) return;

    const reason = await prompt({
      title: "Motivo do cancelamento",
      label: "Comentário clínico",
      confirmLabel: "Cancelar vacinação",
    });

    if (reason === null) return;

    await cancelVaccinationProtocol(vaccination.vaccination_public_id, {
      comment: reason,
    });

    onCancelled?.(vaccination.vaccination_public_id);
  }

  return (
    <div className="rounded-lg border bg-white px-4 py-3 space-y-3">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="space-y-1 min-w-0">

          <p className="font-medium text-zinc-900 truncate">
            {vaccination.vaccine_name}
          </p>

          <p className="text-xs text-zinc-500">
            Fabricante: {vaccination.manufacturer ?? "—"}
          </p>

          <p className="text-xs text-zinc-500">
            Lote: {vaccination.batch_number ?? "—"}
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {vaccination.status}
          </span>

          {vaccination.status !== "cancelled" && (
            <button
              onClick={handleCancelProtocol}
              className="text-xs text-red-600 hover:underline"
            >
              cancelar
            </button>
          )}

        </div>

      </div>

      {/* DOSES */}

      <div className="space-y-1">

        {vaccination.doses.map((dose) => {

          const canApply = dose.status === "scheduled";

          return (
            <div
              key={dose.public_id}
              className="flex items-center justify-between text-xs border rounded px-2 py-1"
            >

              <div className="flex items-center gap-2">

                <span className="font-medium">
                  Dose {dose.dose_number}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full ${statusBadge(dose.status)}`}
                >
                  {dose.status}
                </span>

                {dose.scheduled_at && (
                  <span className="text-zinc-500">
                    prevista {new Date(dose.scheduled_at).toLocaleDateString("pt-PT")}
                  </span>
                )}

                {dose.applied_at && (
                  <span className="text-zinc-500">
                    aplicada {new Date(dose.applied_at).toLocaleDateString("pt-PT")}
                  </span>
                )}

              </div>

              {canApply && (
                <button
                  onClick={() => handleApplyDose(dose.public_id)}
                  className="text-blue-600 hover:underline"
                >
                  aplicar
                </button>
              )}

            </div>
          );
        })}

      </div>

      {/* HISTÓRICO */}

      {vaccination.events.length > 0 && (

        <div className="pt-2 border-t space-y-1">

          <p className="text-xs font-medium text-zinc-700">
            Histórico
          </p>

          {vaccination.events.map((e) => (

            <div
              key={e.public_id}
              className="text-xs text-zinc-600"
            >

              <span className="font-medium">
                {e.type}
              </span>

              {e.comment && (
                <span>
                  {" — "}
                  {e.comment}
                </span>
              )}

              <span className="text-zinc-400 ml-2">
                {new Date(e.created_at).toLocaleString("pt-PT")}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
