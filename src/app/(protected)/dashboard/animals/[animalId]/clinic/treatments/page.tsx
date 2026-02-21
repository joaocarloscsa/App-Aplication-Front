"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimalTreatmentScheduleCreateForm } from "@/components/animals/clinic/AnimalTreatmentScheduleCreateForm";
import { AnimalTreatmentCreateForm } from "@/components/animals/clinic/AnimalTreatmentCreateForm";
import { fetchAnimalTreatments, TreatmentDTO } from "@/services/animalTreatments";
import type { TreatmentScheduleDTO } from "@/services/animalTreatments";

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
    if (s.interval_in_days === 1) {
      return "Diário";
    }
    return `A cada ${s.interval_in_days} dias`;
  }

  return "";
}

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
        .filter((t): t is TreatmentDTO => Boolean(t && t.treatment_public_id))
        .sort((a, b) => {
          const da = new Date(a.created_at).getTime();
          const db = new Date(b.created_at).getTime();
          return db - da;
        })
    );
  }

  useEffect(() => {
    reload()
      .catch(() => setError("Erro ao carregar tratamentos."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Carregando tratamentos…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Tratamentos</h2>

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
            {/* HEADER — SEMPRE VISÍVEL */}
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

            {/* METADADOS SEMPRE VISÍVEIS */}
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
                {t.ends_at
                  ? ` • Fim: ${new Date(t.ends_at).toLocaleString()}`
                  : ""}
              </p>
            </div>

            {/* EXPANSÃO — DETALHES */}
            {isExpanded && (
              <div className="space-y-2 pt-2 border-t">
                {t.notes && (
                  <div className="text-sm text-zinc-700 rounded bg-zinc-50 p-2 border">
                    {t.notes}
                  </div>
                )}
              </div>
            )}

            {/* SCHEDULES — NÃO INTERFERE NA EXPANSÃO */}
            <div
              className="pt-2 border-t"
              onClick={(e) => e.stopPropagation()}
            >


{/* SCHEDULES EXISTENTES */}
{t.schedules && t.schedules.length > 0 && (
  <div className="space-y-2 pt-2 border-t">
    <p className="text-xs font-medium text-zinc-700">
      Medicações / Procedimentos
    </p>

    {t.schedules.map((s) => (
      <div
        key={s.schedule_public_id}
        className="rounded border bg-zinc-50 p-2 text-xs space-y-1"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-zinc-600">
            {s.schedule_public_id}
          </span>

<span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">
  {renderFrequencyLabel(s)}
</span>
        </div>

        {/* HORÁRIOS */}
{s.frequency_type === "daily_times" && s.daily_times && (
  <p className="text-xs text-zinc-700">
    Horários:{" "}
    <span className="font-medium">
      {s.daily_times.join(", ")}
    </span>
  </p>
)}

{s.frequency_type === "interval_days" && s.interval_execution_time && (
  <p className="text-xs text-zinc-700">
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

        {/* OBSERVAÇÕES */}
        {s.notes && (
          <p className="italic text-zinc-600">
            {s.notes}
          </p>
        )}

        <p className="text-zinc-500">
          Início:{" "}
          {new Date(s.starts_at).toLocaleDateString()}
          {s.ends_at &&
            ` • Fim: ${new Date(s.ends_at).toLocaleDateString()}`}
        </p>
      </div>
    ))}
  </div>
)}
              
              <AnimalTreatmentScheduleCreateForm
                animalId={animalId}
                treatmentPublicId={t.treatment_public_id}
                onCreated={async () => {
                  await reload();
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}