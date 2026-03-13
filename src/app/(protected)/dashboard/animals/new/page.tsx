// path: /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/new/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAnimal, ParentPayload } from "@/services/animals";
import { AnimalParentAutocomplete } from "@/components/animals/AnimalParentAutocomplete";
import { ExternalParentFields } from "@/components/animals/ExternalParentFields";
import { http } from "@/services/http";

type AnimalType = {
  code: string;
  label: string;
};

type Mode = "single" | "litter";
type ParentMode = "none" | "internal" | "external";

type ExternalParent = {
  call_name?: string;
  official_name?: string;
  provisional_name?: string;
  microchip_number?: string;
  registry_issuer?: string;
  registry_number?: string;
  breed?: string;
  notes?: string;
};

export default function NewAnimalPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("single");
  const [litterCount, setLitterCount] = useState<number>(2);

  const [types, setTypes] = useState<AnimalType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [singleType, setSingleType] = useState<string | undefined>();

  const [litterForm, setLitterForm] = useState<{
    type?: string;
    provisional_name?: string;
    sex?: "male" | "female" | "unknown";
    breed?: string;
    coat_color?: string;
    coat_type?: string;
    birth_date?: string;
    registry_issuer?: string;
    notes?: string;
  }>({});

  const [fatherMode, setFatherMode] = useState<ParentMode>("none");
  const [motherMode, setMotherMode] = useState<ParentMode>("none");

  const [fatherInternal, setFatherInternal] = useState<{ public_id: string } | undefined>();
  const [motherInternal, setMotherInternal] = useState<{ public_id: string } | undefined>();

  const [fatherExternal, setFatherExternal] = useState<ExternalParent>({});
  const [motherExternal, setMotherExternal] = useState<ExternalParent>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTypes() {
      try {
        const res = await http<AnimalType[]>("/api/v1/animal-types");
        if (active) setTypes(res ?? []);
      } finally {
        if (active) setLoadingTypes(false);
      }
    }

    loadTypes();
    return () => {
      active = false;
    };
  }, []);

  function setLitterField<K extends keyof typeof litterForm>(k: K, v: any) {
    setLitterForm((prev) => ({
      ...prev,
      [k]: v === "" ? undefined : v,
    }));
  }

  const fatherPayload: ParentPayload | undefined = useMemo(() => {
    if (fatherMode === "internal") return fatherInternal;
    if (fatherMode === "external") {
      const hasAny = Object.values(fatherExternal).some((x) => !!(x && String(x).trim()));
      return hasAny ? (fatherExternal as any) : undefined;
    }
    return undefined;
  }, [fatherMode, fatherInternal, fatherExternal]);

  const motherPayload: ParentPayload | undefined = useMemo(() => {
    if (motherMode === "internal") return motherInternal;
    if (motherMode === "external") {
      const hasAny = Object.values(motherExternal).some((x) => !!(x && String(x).trim()));
      return hasAny ? (motherExternal as any) : undefined;
    }
    return undefined;
  }, [motherMode, motherInternal, motherExternal]);

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      if (mode === "single" && !singleType) {
        setError("Selecione o tipo do animal.");
        setLoading(false);
        return;
      }

      if (mode === "litter" && !litterForm.type) {
        setError("Selecione o tipo do animal.");
        setLoading(false);
        return;
      }

      const response =
        mode === "litter"
          ? await createAnimal({
              mode: "litter",
              data: {
                count: litterCount,
                ...litterForm,
                father: fatherPayload as any,
                mother: motherPayload as any,
              },
            })
          : await createAnimal({
              mode: "single",
              data: {
                basic: {
                  type: singleType,
                },
              },
            });

      if ("public_id" in response && !("animals" in response)) {
        router.push(`/dashboard/animals/${(response as any).public_id}`);
        return;
      }

      if ("animals" in response && Array.isArray((response as any).animals)) {
        const litterId = (response as any).public_id as string | undefined;
        const animals = (response as any).animals as Array<{ public_id: string }>;
        const ids = animals.map((a) => a.public_id).filter(Boolean);

        if (ids.length > 0) {
          const qs = new URLSearchParams();
          if (litterId) qs.set("litter", litterId);
          qs.set("animals", ids.join(","));
          router.push(`/dashboard/animals/litter-created?${qs.toString()}`);
          return;
        }
      }

      throw new Error("Resposta inesperada do servidor");
    } catch {
      setError("Erro ao criar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Criar animal</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Apenas <b>Espécie de Animal</b> é obrigatório.
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <label className="mb-3 block text-sm font-medium text-zinc-700">
            Tipo de criação
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`rounded-lg border px-4 py-2 text-sm ${
                mode === "single"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              Animal avulso
            </button>

            <button
              type="button"
              onClick={() => setMode("litter")}
              className={`rounded-lg border px-4 py-2 text-sm ${
                mode === "litter"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              Ninhada
            </button>
          </div>
        </div>

        {mode === "single" && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <label className="block text-xs text-zinc-600">Espécie *</label>
            <select
              value={singleType ?? ""}
              disabled={loadingTypes}
              onChange={(e) => setSingleType(e.target.value || undefined)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {types.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === "litter" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Quantidade de animais na ninhada
              </label>

              <input
                type="number"
                min={1}
                value={litterCount}
                onChange={(e) => setLitterCount(Number(e.target.value))}
                className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-900">
                Dados compartilháveis (opcionais)
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-zinc-600">Nome provisório</label>
                    <input
                      type="text"
                      value={litterForm.provisional_name ?? ""}
                      onChange={(e) => setLitterField("provisional_name", e.target.value)}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-600">Espécie *</label>
                  <select
                    value={litterForm.type ?? ""}
                    disabled={loadingTypes}
                    onChange={(e) => setLitterField("type", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    {types.map((t) => (
                      <option key={t.code} value={t.code}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-600">Sexo</label>
                  <select
                    value={litterForm.sex ?? ""}
                    onChange={(e) => setLitterField("sex", e.target.value as any)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                    <option value="unknown">Desconhecido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-600">Data de nascimento</label>
                  <input
                    type="date"
                    value={litterForm.birth_date ?? ""}
                    onChange={(e) => setLitterField("birth_date", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-600">Cor da pelagem</label>
                  <input
                    type="text"
                    value={litterForm.coat_color ?? ""}
                    onChange={(e) => setLitterField("coat_color", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-600">Tipo de pelagem</label>
                  <input
                    type="text"
                    value={litterForm.coat_type ?? ""}
                    onChange={(e) => setLitterField("coat_type", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-zinc-600">Órgão registrador</label>
                  <input
                    type="text"
                    value={litterForm.registry_issuer ?? ""}
                    onChange={(e) => setLitterField("registry_issuer", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-zinc-600">Observações (notes)</label>
                  <textarea
                    rows={3}
                    value={litterForm.notes ?? ""}
                    onChange={(e) => setLitterField("notes", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900">Pai (opcional)</h2>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFatherMode("none")}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    fatherMode === "none"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Nenhum
                </button>
                <button
                  type="button"
                  onClick={() => setFatherMode("internal")}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    fatherMode === "internal"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Interno
                </button>
                <button
                  type="button"
                  onClick={() => setFatherMode("external")}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    fatherMode === "external"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Externo
                </button>
              </div>

              {fatherMode === "internal" && (
                <AnimalParentAutocomplete
                  kind="father"
                  mode="litter"
                  onSelect={setFatherInternal}
                />
              )}

              {fatherMode === "external" && (
                <ExternalParentFields value={fatherExternal} onChange={setFatherExternal} />
              )}
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900">Mãe (opcional)</h2>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMotherMode("none")}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    motherMode === "none"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Nenhum
                </button>
                <button
                  type="button"
                  onClick={() => setMotherMode("internal")}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    motherMode === "internal"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Interno
                </button>
                <button
                  type="button"
                  onClick={() => setMotherMode("external")}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    motherMode === "external"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Externo
                </button>
              </div>

              {motherMode === "internal" && (
                <AnimalParentAutocomplete
                  kind="mother"
                  mode="litter"
                  onSelect={setMotherInternal}
                />
              )}

              {motherMode === "external" && (
                <ExternalParentFields value={motherExternal} onChange={setMotherExternal} />
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar"}
          </button>

          {mode === "litter" && (
            <p className="mt-3 text-xs text-zinc-500">
              A ninhada será criada já com os dados acima aplicados. Depois, a edição é individual.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}