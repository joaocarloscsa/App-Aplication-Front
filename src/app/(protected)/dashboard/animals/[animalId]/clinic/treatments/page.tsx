"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimalTreatmentCreateForm } from "@/components/animals/clinic/AnimalTreatmentCreateForm";
import {
  fetchAnimalTreatments,
  TreatmentDTO,
} from "@/services/animalTreatments";
import { TreatmentStatusActions } from "@/components/animals/clinic/TreatmentStatusActions";
import { HttpError } from "@/services/http";
import { TreatmentSchedulesSection } from "@/components/animals/clinic/TreatmentSchedulesSection";
import { CopyId } from "@/components/dashboard/CopyId";

/* =========================
 * Helpers
 * ========================= */

function getTreatmentStatusLabel(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "active") return "Ativo";
  if (s === "paused") return "Pausado";
  if (s === "cancelled" || s === "canceled") return "Cancelado";
  if (s === "finished") return "Finalizado";

  return status;
}

function getTreatmentStatusBadge(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "active")
    return "bg-green-100 text-green-700";

  if (s === "paused")
    return "bg-yellow-100 text-yellow-700";

  if (s === "finished")
    return "bg-blue-100 text-blue-700";

  if (s === "cancelled" || s === "canceled")
    return "bg-red-100 text-red-700";

  return "bg-zinc-100 text-zinc-600";
}

function humanizeRole(role?: string | null) {
  if (!role) return null;
  if (role === "medico_veterinario") return "Médico veterinário";
  if (role === "tutor") return "Tutor";
  return role;
}

function buildScheduleSummary(schedules: TreatmentDTO["schedules"]) {
  const total = schedules.length;

  const active = schedules.filter(
    (s) => s.meta?.status === "active"
  ).length;

  const finished = schedules.filter(
    (s) => s.meta?.status === "finished"
  ).length;

  const cancelled = schedules.filter(
    (s) => s.meta?.status === "cancelled"
  ).length;

  const paused = schedules.filter(
    (s) => s.meta?.status === "paused"
  ).length;

  return { total, active, finished, cancelled, paused };
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
  const [expandedTreatmentId, setExpandedTreatmentId] =
    useState<string | null>(null);

  async function reload() {
    if (!animalId) return;

    try {
      const treatments = await fetchAnimalTreatments(animalId);

      setItems(
        treatments
          .filter(
            (t): t is TreatmentDTO =>
              Boolean(t?.treatment_public_id)
          )
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
      );

      setError(null);
    } catch (e) {
      if (e instanceof HttpError) {
        const code = (e.body as any)?.error ?? null;

        if (code === "unauthenticated") {
          setError("Sessão expirada. Faça login novamente.");
          return;
        }

        setError("Erro ao carregar tratamentos.");
        return;
      }

      setError("Erro inesperado ao carregar tratamentos.");
    }
  }

  useEffect(() => {
    reload()
      .catch(() => setError("Erro ao carregar tratamentos."))
      .finally(() => setLoading(false));
  }, [animalId]);

  if (loading) {
    return (
      <p className="text-sm text-zinc-500">
        Carregando tratamentos…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER GERAL */}
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
        const isExpanded =
          expandedTreatmentId === t.treatment_public_id;

        const summary = buildScheduleSummary(t.schedules);

        return (
          <div
            key={t.treatment_public_id}
            className="rounded-lg border bg-white px-4 py-3"
          >
            {/* HEADER DO TRATAMENTO */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-zinc-900 truncate">
                  {t.name}
                </p>


                <p className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  {t.treatment_public_id}
                  <CopyId id={t.treatment_public_id} showValue={false} />
                </p>

                {/* RESUMO */}
                <div className="text-[11px] text-zinc-600 leading-tight mt-1">
                  <div>
                    {summary.total} prescrições
                  </div>

                  <div className="flex gap-2 flex-wrap mt-1">
                    {summary.active > 0 && (
                      <span className="text-green-600">
                        {summary.active} ativas
                      </span>
                    )}
                    {summary.finished > 0 && (
                      <span className="text-blue-600">
                        {summary.finished} finalizadas
                      </span>
                    )}
                    {summary.cancelled > 0 && (
                      <span className="text-red-600">
                        {summary.cancelled} canceladas
                      </span>
                    )}
                    {summary.paused > 0 && (
                      <span className="text-yellow-600">
                        {summary.paused} pausadas
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getTreatmentStatusBadge(
                    t.status
                  )}`}
                >
                  {getTreatmentStatusLabel(t.status)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedTreatmentId((current) =>
                      current === t.treatment_public_id
                        ? null
                        : t.treatment_public_id
                    )
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  {isExpanded ? "Recolher" : "Expandir"}
                </button>
              </div>
            </div>

            {/* CONTEÚDO EXPANDIDO */}
            {isExpanded && (
              <div className="pt-4 space-y-4 border-t mt-3">
                {/* METADADOS */}
                <div className="text-xs text-zinc-600 space-y-0.5">
                  <p>
                    Criado por{" "}
                    <span className="font-medium">
                      {t.created_by?.name ?? "—"}
                    </span>
                    {t.actor?.role_at_creation && (
                      <>
                        {" • "}
                        <span className="italic">
                          {humanizeRole(
                            t.actor.role_at_creation
                          )}
                        </span>
                      </>
                    )}
                  </p>

                  <p>
                    Início:{" "}
                    {new Date(t.starts_at).toLocaleString("pt-PT")}
                    {t.ends_at &&
                      ` • Fim: ${new Date(
                        t.ends_at
                      ).toLocaleString("pt-PT")}`}
                  </p>
                </div>

                {/* OBSERVAÇÃO */}
                {t.notes && (
                  <div className="text-sm text-zinc-700 rounded bg-zinc-50 p-2 border">
                    {t.notes}
                  </div>
                )}

                {/* AÇÕES */}
                <TreatmentStatusActions
                  treatmentPublicId={t.treatment_public_id}
                  currentStatus={t.status}
                  onChanged={reload}
                />

                {/* PRESCRIÇÕES */}
                <TreatmentSchedulesSection
                  treatmentPublicId={t.treatment_public_id}
                  schedules={t.schedules}
                  onReload={reload}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}