"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getClinicalProblem,
  getClinicalProblemTimeline,
  type ClinicalProblemDetailsDTO,
  type ClinicalProblemTimelineEventDTO,
} from "@/services/clinicalProblems";
import { ProblemTimeline } from "@/components/animals/clinic/problems/ProblemTimeline";
import { ProblemDiagnosisEditor } from "@/components/animals/clinic/problems/ProblemDiagnosisEditor";
import { ProblemStatusSelector } from "@/components/animals/clinic/problems/ProblemStatusSelector";
import { ClinicalProblemNoteForm } from "@/components/animals/clinic/problems/ClinicalProblemNoteForm";

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ClinicalProblemDetailsPage() {
  const { problemId } = useParams<{ problemId: string }>();

  const [details, setDetails] = useState<ClinicalProblemDetailsDTO | null>(null);
  const [timeline, setTimeline] = useState<ClinicalProblemTimelineEventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDetails() {
    if (!problemId) return;

    const data = await getClinicalProblem(problemId);
    setDetails(data);
  }

  async function loadTimeline() {
    if (!problemId) return;

    setTimelineLoading(true);

    try {
      const data = await getClinicalProblemTimeline(problemId);
      setTimeline(data);
    } finally {
      setTimelineLoading(false);
    }
  }

  async function loadAll() {
    if (!problemId) return;

    try {
      setLoading(true);
      setError(null);

      await Promise.all([loadDetails(), loadTimeline()]);
    } catch {
      setError("Erro ao carregar problema clínico.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [problemId]);

  if (loading) {
    return <div className="text-sm text-zinc-500">Carregando…</div>;
  }

  if (error || !details) {
    return (
      <div className="text-sm text-red-600">
        {error || "Problema não encontrado."}
      </div>
    );
  }

  const problem = details.problem;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {problem.title}
            </h2>

            <p className="text-xs text-zinc-500">
              {problem.public_id}
            </p>
          </div>

          <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
            {problem.status.label}
          </span>
        </div>

        <div className="grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
          <p>
            <span className="font-medium text-zinc-700">Criado em:</span>{" "}
            {formatDate(problem.created_at)}
          </p>

          <p>
            <span className="font-medium text-zinc-700">Iniciado em:</span>{" "}
            {formatDate(problem.started_at)}
          </p>

          <p>
            <span className="font-medium text-zinc-700">Encerrado em:</span>{" "}
            {formatDate(problem.closed_at)}
          </p>

          <p>
            <span className="font-medium text-zinc-700">Responsável:</span>{" "}
            {problem.created_by?.name || "—"}
          </p>
        </div>

        {problem.consultation_origin ? (
          <div className="rounded border bg-zinc-50 p-3 text-sm text-zinc-600">
            <p className="font-medium text-zinc-700">
              Consulta de origem
            </p>

            <p>ID: {problem.consultation_origin.public_id || "—"}</p>
            <p>Data: {formatDate(problem.consultation_origin.date_time)}</p>

            {problem.consultation_origin.chief_complaint ? (
              <p className="mt-1">
                <span className="font-medium text-zinc-700">
                  Queixa:
                </span>{" "}
                {problem.consultation_origin.chief_complaint}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProblemDiagnosisEditor
          problemPublicId={problem.public_id}
          value={problem.current_diagnosis}
          onUpdated={loadAll}
        />

        <ProblemStatusSelector
          problemPublicId={problem.public_id}
          currentStatusCode={problem.status.code}
          onUpdated={loadAll}
        />
      </div>

      <ClinicalProblemNoteForm
        problemPublicId={problem.public_id}
        onCreated={loadTimeline}
      />

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            Timeline clínica
          </h3>

          <p className="text-xs text-zinc-500">
            Histórico completo do problema ao longo do tempo.
          </p>
        </div>

        {timelineLoading ? (
          <div className="text-sm text-zinc-500">Carregando timeline…</div>
        ) : (
          <ProblemTimeline items={timeline} />
        )}
      </section>
    </div>
  );
}
