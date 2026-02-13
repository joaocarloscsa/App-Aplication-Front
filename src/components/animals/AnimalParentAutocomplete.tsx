// path: /var/www/GSA/animal/frontend/src/components/animals/AnimalParentAutocomplete.tsx

"use client";

import { useEffect, useState } from "react";
import {
  searchAnimals,
  updateAnimalParents,
  getAnimal,
  AnimalListItem,
} from "@/services/animals";

type ParentSnapshot = {
  official_name?: string | null;
  microchip_number?: string | null;
  registry_issuer?: string | null;
  registry_number?: string | null;
  breed?: string | null;
  notes?: string | null;
};

type Props = {
  kind: "father" | "mother";

  /**
   * edit  = comportamento original (PATCH + refresh + snapshot)
   * litter = somente seleciona o public_id (sem PATCH)
   */
  mode?: "edit" | "litter";

  /**
   * Necessário apenas no modo edit.
   */
  animalId?: string;

  /**
   * Callback original do modo edit (mantido).
   */
  onSaved?: (data: {
    parent_public_id: string;
    snapshot: ParentSnapshot;
  }) => void;

  /**
   * Callback do modo litter.
   */
  onSelect?: (payload: { public_id: string }) => void;
};

export function AnimalParentAutocomplete({
  animalId,
  kind,
  onSaved,
  onSelect,
  mode = "edit",
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimalListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      setLoading(true);
      setError(null);

      searchAnimals(query)
        .then(setResults)
        .catch(() => setError("Erro ao buscar animais."))
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query]);

  async function handleSelect(animal: AnimalListItem) {
    // ✅ sempre mostrar o PUBLIC_ID no input
    setQuery(animal.public_id);
    setResults([]);
    setError(null);

    // =========================
    // MODO LITTER: só captura id
    // =========================
    if (mode === "litter") {
      onSelect?.({ public_id: animal.public_id });
      return;
    }

    // =========================
    // MODO EDIT: comportamento original
    // =========================
    if (!animalId) {
      setError("animalId ausente para modo edit.");
      return;
    }

    try {
      setSaving(true);

      await updateAnimalParents(animalId, {
        [kind]: { public_id: animal.public_id },
      });

      const updatedAnimal = await getAnimal<any>(animalId);
      const parentNode = updatedAnimal?.[kind];
      const snapshot = parentNode?.snapshot ?? {};

      onSaved?.({
        parent_public_id: animal.public_id,
        snapshot,
      });
    } catch {
      setError("Erro ao definir vínculo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder={`Buscar ${kind === "father" ? "pai" : "mãe"}…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

      {(loading || (mode === "edit" && saving)) && (
        <div className="text-xs text-zinc-500">
          {mode === "edit" && saving ? "Definindo vínculo…" : "Buscando…"}
        </div>
      )}

      {results.length > 0 && (
        <ul className="rounded-lg border bg-white shadow-sm">
          {results.map((a) => (
            <li
              key={a.public_id}
              onClick={() => handleSelect(a)}
              className="cursor-pointer px-3 py-2 hover:bg-zinc-100"
            >
              <div className="font-semibold text-sm">
                {a.call_name || a.official_name || "Sem nome"}
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                {a.public_id}
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
