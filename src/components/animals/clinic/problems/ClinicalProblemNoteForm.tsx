"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addClinicalProblemNote,
  listClinicalProblemEventTypes,
  type ClinicalProblemEventTypeDTO,
} from "@/services/clinicalProblems";

const ALLOWED_CODES = [
  "EVOLUTION_NOTE",
  "OBSERVATION_NOTE",
  "REVIEW_NOTE",
  "STRATEGY_CHANGED",
];

type Props = {
  problemPublicId: string;
  onCreated(): Promise<void> | void;
};

export function ClinicalProblemNoteForm({
  problemPublicId,
  onCreated,
}: Props) {
  const [eventTypes, setEventTypes] = useState<ClinicalProblemEventTypeDTO[]>([]);
  const [type, setType] = useState("EVOLUTION_NOTE");
  const [content, setContent] = useState("");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedTypes = useMemo(
    () => eventTypes.filter((item) => ALLOWED_CODES.includes(item.code)),
    [eventTypes]
  );

  useEffect(() => {
    listClinicalProblemEventTypes()
      .then((res) => setEventTypes(res))
      .catch(() => setEventTypes([]))
      .finally(() => setLoadingCatalog(false));
  }, []);

  useEffect(() => {
    if (allowedTypes.length > 0 && !allowedTypes.some((item) => item.code === type)) {
      setType(allowedTypes[0].code);
    }
  }, [allowedTypes, type]);

  async function submit() {
    setError(null);

    if (!content.trim()) {
      setError("O conteúdo da nota é obrigatório.");
      return;
    }

    try {
      setLoading(true);

      await addClinicalProblemNote(problemPublicId, {
        type,
        content: content.trim(),
      });

      setContent("");
      await onCreated();
    } catch {
      setError("Erro ao registrar nota clínica.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Adicionar nota clínica
        </h3>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <select
        className="w-full rounded border px-3 py-2 text-sm"
        value={type}
        onChange={(e) => setType(e.target.value)}
        disabled={loadingCatalog || loading}
      >
        {allowedTypes.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>

      <textarea
        rows={4}
        className="w-full rounded border px-3 py-2 text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Registre evolução, observação, revisão ou estratégia."
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={loading || loadingCatalog}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Registrar nota"}
        </button>
      </div>
    </div>
  );
}
