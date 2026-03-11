"use client";

import { useEffect, useState } from "react";
import {
  changeClinicalProblemStatus,
  listClinicalProblemStatusCodes,
  type ClinicalProblemStatusDTO,
} from "@/services/clinicalProblems";

type Props = {
  problemPublicId: string;
  currentStatusCode: string;
  onUpdated(): Promise<void> | void;
};

export function ProblemStatusSelector({
  problemPublicId,
  currentStatusCode,
  onUpdated,
}: Props) {
  const [items, setItems] = useState<ClinicalProblemStatusDTO[]>([]);
  const [statusCode, setStatusCode] = useState(currentStatusCode);
  const [loading, setLoading] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatusCode(currentStatusCode);
  }, [currentStatusCode]);

  useEffect(() => {
    listClinicalProblemStatusCodes()
      .then((res) => setItems(res))
      .catch(() => setItems([]))
      .finally(() => setLoadingCatalog(false));
  }, []);

  async function submit() {
    setError(null);

    try {
      setLoading(true);
      await changeClinicalProblemStatus(problemPublicId, statusCode);
      await onUpdated();
    } catch {
      setError("Erro ao alterar status do problema.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Status do problema
        </h3>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <select
        className="w-full rounded border px-3 py-2 text-sm"
        value={statusCode}
        onChange={(e) => setStatusCode(e.target.value)}
        disabled={loadingCatalog || loading}
      >
        {items.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={loading || loadingCatalog || statusCode === currentStatusCode}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar status"}
        </button>
      </div>
    </div>
  );
}
