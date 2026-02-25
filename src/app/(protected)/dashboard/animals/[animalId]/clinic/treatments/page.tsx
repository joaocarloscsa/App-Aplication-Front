"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimalTreatmentScheduleCreateForm } from "@/components/animals/clinic/AnimalTreatmentScheduleCreateForm";
import { AnimalTreatmentCreateForm } from "@/components/animals/clinic/AnimalTreatmentCreateForm";
import {
  fetchAnimalTreatments,
  TreatmentDTO,
  TreatmentScheduleDTO,
} from "@/services/animalTreatments";
import { TreatmentStatusActions } from "@/components/animals/clinic/TreatmentStatusActions";
import { CollapsibleNotes } from "@/components/common/CollapsibleNotes";
import { MedicationNotes } from "@/components/common/MedicationNotes";
import { TreatmentScheduleStatusActions } from "@/components/animals/clinic/TreatmentScheduleStatusActions";
import { MedicationStatusHistory } from "@/components/animals/clinic/MedicationStatusHistory";
import { TreatmentScheduleTimeline } from
  "@/components/animals/clinic/TreatmentScheduleTimeline";

/* =========================
 * Helpers
 * ========================= */

function humanizeStatus(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "Ativo";
  if (s === "paused") return "Pausado";
  if (s === "cancelled" || s === "canceled") return "Cancelado";
  if (s === "finished") return "Finalizado";
  return status;
}

function humanizeRole(role?: string | null) {
  if (!role) return null;
  if (role === "medico_veterinario") return "Médico veterinário";
  if (role === "tutor") return "Tutor";
  return role;
}

function renderFrequencyLabel(s: TreatmentScheduleDTO): string {
  if (s.frequency_type === "daily_times") {
    return `${s.daily_times_count}x por dia`;
  }

  if (s.frequency_type === "interval_days") {
    if (s.interval_in_days === 1) return "Diário";
    return `A cada ${s.interval_in_days} dias`;
  }

  return "";
}

function renderScheduleStatus(status: string) {
  if (status === "active")
    return (
      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-green-100 text-green-800">
        Ativa
      </span>
    );
  if (status === "paused")
    return (
      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
        Suspensa
      </span>
    );
  return (
    <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-red-100 text-red-800">
      Cancelada
    </span>
  );
}

/* =========================
 * Page
 * ========================= */

export default function AnimalClinicTreatmentsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  const [items, setItems] = useState<TreatmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedTreatmentId, setExpandedTreatmentId] = useState<string | null>(
    null
  );

  async function reload() {
    if (!animalId) return;

    const treatments = await fetchAnimalTreatments(animalId);

    setItems(
      treatments
        .filter((t): t is TreatmentDTO => Boolean(t?.treatment_public_id))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
    );
  }

  useEffect(() => {
    reload()
      .catch(() => setError("Erro ao carregar tratamentos."))
      .finally(() => setLoading(false));
  }, [animalId]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando tratamentos…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

 return (
  <div className="space-y-4">
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-zinc-900">
        Tratamentos clínicos
      </h2>

      <button
        type="button"
        onClick={() => setShowCreateForm(true)}
        className="text-sm font-medium text-zinc-900 hover:underline"
      >
        + Novo tratamento
      </button>
    </div>

    {showCreateForm && (
      <AnimalTreatmentCreateForm
        animalPublicId={animalId}
        onCancel={() => setShowCreateForm(false)}
        onCreated={async () => {
          await reload();
          setShowCreateForm(false);
        }}
      />
    )}

    {items.length === 0 && (
      <p className="text-sm text-zinc-500">
        Nenhum tratamento registrado para este animal.
      </p>
    )}

    {items.map((t) => {
      const isExpanded = expandedTreatmentId === t.treatment_public_id;

      return (
        <div
          key={t.treatment_public_id}
          className="rounded-lg border bg-white px-4 py-3 space-y-3"
        >
          {/* TRATAMENTO — HEADER */}
          <div
            className="flex items-start justify-between gap-3 cursor-pointer"
            onClick={() =>
              setExpandedTreatmentId((current) =>
                current === t.treatment_public_id
                  ? null
                  : t.treatment_public_id
              )
            }
          >
            <div className="min-w-0 space-y-0.5">
              <p className="font-medium text-zinc-900 truncate">{t.name}</p>
              <p className="text-xs text-zinc-500 font-mono">
                {t.treatment_public_id}
              </p>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
              {humanizeStatus(t.status)}
            </span>
          </div>

          {/* TRATAMENTO — METADADOS */}
          <div className="text-xs text-zinc-600 space-y-0.5">
            <p>
              Criado por{" "}
              <span className="font-medium">
                {t.created_by?.name ?? "—"}
              </span>
              {t.actor?.role_at_creation && (
                <>
                  {" "}
                  •{" "}
                  <span className="italic">
                    {humanizeRole(t.actor.role_at_creation)}
                  </span>
                </>
              )}
            </p>

            <p>
              Início: {new Date(t.starts_at).toLocaleString()}
              {t.ends_at &&
                ` • Fim: ${new Date(t.ends_at).toLocaleString()}`}
            </p>
          </div>

          {/* TRATAMENTO — OBSERVAÇÃO */}
          {isExpanded && t.notes && (
            <div className="pt-2 border-t">
              <div className="text-sm text-zinc-700 rounded bg-zinc-50 p-2 border">
                {t.notes}
              </div>
            </div>
          )}

          {/* AÇÕES DO TRATAMENTO */}
          <TreatmentStatusActions
            treatmentPublicId={t.treatment_public_id}
            currentStatus={t.status}
            onChanged={reload}
          />

          {/* PRESCRIÇÕES */}
          <div
            className="pt-3 border-t space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold text-zinc-800">
              Prescrições (medicações / procedimentos)
            </p>

            {t.schedules.length === 0 && (
              <p className="text-xs text-zinc-500 italic">
                Nenhuma prescrição registrada neste tratamento.
              </p>
            )}

            {t.schedules.map((s) => {
              const title =
                s.medication_name ||
                s.dosage_description ||
                "Medicação / Procedimento";

              return (
                <div
                  key={s.schedule_public_id}
                  className="rounded border bg-zinc-50 p-3 space-y-2 text-xs"
                >
                  {/* TOPO DA PRESCRIÇÃO */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-zinc-900">
                        {title}
                      </p>

                      {s.created_by ? (
                        <p className="text-[11px] text-zinc-500">
                          Prescrito por{" "}
                          <span className="font-medium">
                            {s.created_by.name}
                          </span>{" "}
                          <span className="font-mono">
                            ({s.created_by.person_public_id})
                          </span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-400 italic">
                          Autor da prescrição não informado
                        </p>
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 text-[11px]">
                      {renderFrequencyLabel(s)}
                    </span>
                  </div>

                  {/* HORÁRIOS */}
                  {s.frequency_type === "daily_times" && s.daily_times && (
                    <p>
                      Horários:{" "}
                      <span className="font-medium">
                        {s.daily_times.join(", ")}
                      </span>
                    </p>
                  )}

                  {s.frequency_type === "interval_days" &&
                    s.interval_execution_time && (
                      <p>
                        Horário:{" "}
                        <span className="font-medium">
                          {s.interval_execution_time}
                        </span>
                      </p>
                    )}

                  {/* DOSAGEM */}
                  {s.dosage_description && (
                    <p>Dosagem: {s.dosage_description}</p>
                  )}

                  {/* NOTAS DA MEDICAÇÃO */}
                  {s.notes && (
                    <div className="rounded bg-white border p-2 text-zinc-700 text-xs italic">
                      {s.notes}
                    </div>
                  )}

                  {/* PERÍODO */}
                  <p className="text-zinc-500">
                    Início:{" "}
                    {new Date(s.starts_at).toLocaleDateString()}
                    {s.ends_at &&
                      ` • Fim: ${new Date(
                        s.ends_at
                      ).toLocaleDateString()}`}
                  </p>
                    {/* TIMELINE DA PRESCRIÇÃO */}
                    <TreatmentScheduleTimeline events={s.status_history} />

                    {/* STATUS ATUAL */}
                    {renderScheduleStatus(s.status)}
                   
                    {/* AÇÕES */}
                    <TreatmentScheduleStatusActions
                      schedulePublicId={s.schedule_public_id}
                      currentStatus={s.status}
                      onChanged={reload}
                    />

                  {/* HISTÓRICO (opcional / detalhado) */}
                  <MedicationStatusHistory events={s.status_events} />
                </div>
              );
            })}

            

            {t.status === "active" ? (
              <AnimalTreatmentScheduleCreateForm
                animalId={animalId}
                treatmentPublicId={t.treatment_public_id}
                onCreated={reload}
              />
            ) : (
              <p className="text-xs text-zinc-500 italic">
                Não é possível adicionar prescrições a um tratamento{" "}
                {t.status === "paused" ? "pausado" : "finalizado"}.
              </p>
            )}

            
          </div>
        </div>
      );
    })}
  </div>
);
}