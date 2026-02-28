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
        const isExpanded =
          expandedTreatmentId === t.treatment_public_id;

        return (
          <div
            key={t.treatment_public_id}
            className="rounded-lg border bg-white px-4 py-3 space-y-3"
          >
            {/* HEADER */}
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
                <p className="font-medium text-zinc-900 truncate">
                  {t.name}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  {t.treatment_public_id}
                </p>
              </div>

              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                {humanizeStatus(t.status)}
              </span>
            </div>

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
                {new Date(t.starts_at).toLocaleString()}
                {t.ends_at &&
                  ` • Fim: ${new Date(
                    t.ends_at
                  ).toLocaleString()}`}
              </p>
            </div>

            {/* OBSERVAÇÃO */}
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
            <TreatmentSchedulesSection
              treatmentPublicId={t.treatment_public_id}
              schedules={t.schedules}
              onReload={reload}
            />
          </div>
        );
      })}
    </div>
  );
}