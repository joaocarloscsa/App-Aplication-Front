"use client";

import { useState } from "react";
import { updateClinicalProblemDiagnosis } from "@/services/clinicalProblems";

type Props = {
  problemPublicId: string;
  value?: string | null;
  onUpdated(): Promise<void> | void;
};

export function ProblemDiagnosisEditor({
  problemPublicId,
  value,
  onUpdated,
}: Props) {
  const [diagnosis, setDiagnosis] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaved(null);
    setError(null);

    try {
      setLoading(true);
      await updateClinicalProblemDiagnosis(
        problemPublicId,
        diagnosis.trim() || null
      );
      setSaved("Diagnóstico atualizado.");
      await onUpdated();
    } catch {
      setError("Erro ao atualizar diagnóstico.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Diagnóstico atual
        </h3>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {saved ? <p className="text-xs text-green-600">{saved}</p> : null}

      <textarea
        rows={3}
        className="w-full rounded border px-3 py-2 text-sm"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        placeholder="Ainda não definido"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar diagnóstico"}
        </button>
      </div>
    </div>
  );
}
