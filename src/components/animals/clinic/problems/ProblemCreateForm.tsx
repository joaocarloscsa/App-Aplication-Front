"use client";

import { useState } from "react";
import { createClinicalProblem } from "@/services/clinicalProblems";

type Props = {
  consultationPublicId: string;
  onCreated(problemPublicId: string): Promise<void> | void;
  onCancel(): void;
};

export function ProblemCreateForm({
  consultationPublicId,
  onCreated,
  onCancel,
}: Props) {
  const [title, setTitle] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    if (!title.trim()) {
      setError("O título do problema é obrigatório.");
      return;
    }

    try {
      setLoading(true);

      const result = await createClinicalProblem(consultationPublicId, {
        title: title.trim(),
        diagnosis: diagnosis.trim() || null,
      });

      await onCreated(result.public_id);
    } catch {
      setError("Erro ao criar problema clínico.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Abrir problema clínico
        </h3>

        <p className="text-xs text-zinc-500">
          O problema nasce desta consulta e seguirá em acompanhamento longitudinal.
        </p>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Título do problema
        </label>

        <input
          type="text"
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Ex.: Síndrome gastrointestinal aguda"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Diagnóstico atual
        </label>

        <input
          type="text"
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Opcional"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-zinc-600"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar problema"}
        </button>
      </div>
    </div>
  );
}
