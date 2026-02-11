// /var/www/GSA/animal/frontend/src/components/animals/AnimalParentsForm.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { updateAnimalParents } from "@/services/animals";
import { AnimalParentAutocomplete } from "./AnimalParentAutocomplete";
import { CopyId } from "@/components/dashboard/CopyId";

/* =========================
   TYPES
========================= */

type ParentSnapshot = {
  call_name?: string | null;
  official_name?: string | null;
  provisional_name?: string | null;
  microchip_number?: string | null;
  registry_issuer?: string | null;
  registry_number?: string | null;
  breed?: string | null;
  notes?: string | null;
};

type ParentNode =
  | { exists: false }
  | {
      exists: true;
      snapshot: ParentSnapshot;
      public_id?: string;
    };

type Props = {
  publicId: string;
  animal: any;
  onChanged: () => void;
};

/* =========================
   HELPERS
========================= */

function normalize(node: any): ParentNode {
  if (!node) return { exists: false };

  const snapshot = node.snapshot ?? {};

  if (node.animal || node.public_id) {
    const a = node.animal ?? node;

    return {
      exists: true,
      public_id: a.public_id ?? undefined,
      snapshot: {
        call_name: snapshot.call_name ?? a.call_name ?? null,
        official_name:
          snapshot.official_name ?? a.official_name ?? a.call_name ?? null,
        provisional_name: snapshot.provisional_name ?? null,
        microchip_number: snapshot.microchip_number ?? null,
        registry_issuer: snapshot.registry_issuer ?? null,
        registry_number: snapshot.registry_number ?? null,
        breed: snapshot.breed ?? null,
        notes: snapshot.notes ?? null,
      },
    };
  }

  return {
    exists: true,
    snapshot: {
      call_name: snapshot.call_name ?? null,
      official_name: snapshot.official_name ?? null,
      provisional_name: snapshot.provisional_name ?? null,
      microchip_number: snapshot.microchip_number ?? null,
      registry_issuer: snapshot.registry_issuer ?? null,
      registry_number: snapshot.registry_number ?? null,
      breed: snapshot.breed ?? null,
      notes: snapshot.notes ?? null,
    },
  };
}

/* =========================
   COMPONENT
========================= */

export function AnimalParentsForm({ publicId, animal }: Props) {
  const fatherFromApi = useMemo(() => normalize(animal?.father), [animal]);
  const motherFromApi = useMemo(() => normalize(animal?.mother), [animal]);

  const [drafts, setDrafts] = useState<{
    father: ParentSnapshot;
    mother: ParentSnapshot;
  }>({
    father: {},
    mother: {},
  });

  const [parentIds, setParentIds] = useState<{ father?: string; mother?: string }>(
    {}
  );

  useEffect(() => {
    setDrafts({
      father: fatherFromApi.exists ? fatherFromApi.snapshot : {},
      mother: motherFromApi.exists ? motherFromApi.snapshot : {},
    });

    setParentIds({
      father: fatherFromApi.exists ? fatherFromApi.public_id : undefined,
      mother: motherFromApi.exists ? motherFromApi.public_id : undefined,
    });
  }, [fatherFromApi, motherFromApi]);

  const [saving, setSaving] = useState({ father: false, mother: false });
  const [saved, setSaved] = useState({ father: false, mother: false });
  const [confirm, setConfirm] = useState<{ open: boolean; kind: "father" | "mother" } | null>(null);

  async function save(kind: "father" | "mother") {
    setSaving((s) => ({ ...s, [kind]: true }));
    try {
      await updateAnimalParents(publicId, { [kind]: drafts[kind] });

      setSaved((s) => ({ ...s, [kind]: true }));
      window.setTimeout(
        () => setSaved((s) => ({ ...s, [kind]: false })),
        2000
      );
    } finally {
      setSaving((s) => ({ ...s, [kind]: false }));
    }
  }

  async function confirmRemove() {
    if (!confirm) return;
    const kind = confirm.kind;

    await updateAnimalParents(publicId, { [kind]: { action: "remove" } });
    setParentIds((p) => ({ ...p, [kind]: undefined }));
    setConfirm(null);
  }

  function renderBlock(label: string, kind: "father" | "mother") {
    const s = drafts[kind];
    const id = parentIds[kind];
    const showRemove = Boolean(id);

    return (
      <div className="space-y-3">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold min-w-0">
            <span>{label}</span>

            {id && (
              <>
                <span className="text-xs font-mono text-zinc-700 truncate">
                  {id}
                </span>
                <CopyId id={id} />
              </>
            )}
          </div>

          {showRemove && (
            <button
              type="button"
              onClick={() => setConfirm({ open: true, kind })}
              className="ml-auto text-xs text-red-600 hover:underline"
            >
              Remover
            </button>
          )}
        </div>

        <AnimalParentAutocomplete
          animalId={publicId}
          kind={kind}
          onSaved={({ parent_public_id, snapshot }) => {
            setDrafts((d) => ({ ...d, [kind]: snapshot }));
            setParentIds((p) => ({ ...p, [kind]: parent_public_id }));
          }}
        />

        <div className="text-xs text-zinc-400 text-center">ou</div>

        {/* FORM */}
        <div className="space-y-2">
          {([
            ["call_name", "Nome de chamada"],
            ["official_name", "Nome oficial"],
            ["provisional_name", "Nome provisório"],
            ["microchip_number", "Microchip"],
            ["registry_issuer", "Órgão registrador"],
            ["registry_number", "Número de registro"],
            ["breed", "Raça"],
          ] as const).map(([field, placeholder]) => (
            <input
              key={field}
              className="w-full rounded-lx border px-2 py-1 text-sm"
              placeholder={placeholder}
              value={s[field] ?? ""}
              onChange={(e) =>
                setDrafts((d) => ({
                  ...d,
                  [kind]: { ...d[kind], [field]: e.target.value },
                }))
              }
            />
          ))}

          <textarea
            className="w-full rounded border px-2 py-1 text-sm min-h-[80px]"
            placeholder="Observações"
            value={s.notes ?? ""}
            onChange={(e) =>
              setDrafts((d) => ({
                ...d,
                [kind]: { ...d[kind], notes: e.target.value },
              }))
            }
          />
        </div>

        {/* SAVE BUTTON — FEEDBACK VISUAL */}
        <button
          type="button"
          onClick={() => save(kind)}
          disabled={saving[kind]}
          className={`
            h-10 w-full rounded-lg text-sm font-medium
            transition-colors
            ${
              saved[kind]
                ? "bg-green-600 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }
            disabled:opacity-50
          `}
        >
          {saved[kind]
            ? "Salvo"
            : saving[kind]
            ? "Salvando…"
            : `Salvar ${label.toLowerCase()}`}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {renderBlock("Pai", "father")}
        {renderBlock("Mãe", "mother")}
      </div>

      {confirm?.open && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-zinc-200">
            <div className="px-6 py-4 border-b font-semibold">
              Remover parentesco
            </div>

            <div className="px-6 py-4 text-sm text-zinc-700">
              Tem certeza que deseja remover{" "}
              <strong>{confirm.kind === "father" ? "o pai" : "a mãe"}</strong>?
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setConfirm(null)}>Cancelar</button>
              <button onClick={confirmRemove} className="text-red-600">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
