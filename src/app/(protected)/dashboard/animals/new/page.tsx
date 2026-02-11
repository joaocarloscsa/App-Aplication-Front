// src/app/(protected)/dashboard/animals/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnimal } from "@/services/animals";

type Mode = "single" | "litter";

export default function NewAnimalPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("single");
  const [litterCount, setLitterCount] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      const payload =
        mode === "litter"
          ? {
              litter: {
                count: litterCount,
              },
            }
          : {};

      const response = await createAnimal(payload);

      if ("public_id" in response) {
        router.push(`/dashboard/animals/${response.public_id}`);
        return;
      }

      if (
        "animals" in response &&
        Array.isArray(response.animals) &&
        response.animals.length > 0
      ) {
        router.push(`/dashboard/animals/${response.animals[0].public_id}`);
        return;
      }

      throw new Error("Resposta inesperada do servidor");
    } catch (e: any) {
      setError("Erro ao criar animal. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">
        Criar animal
      </h1>

      <div className="space-y-6">
        {/* Escolha do tipo */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Tipo de criação
          </label>

          <div className="flex gap-3">
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

        {/* Campos da ninhada */}
        {mode === "litter" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Quantidade de animais na ninhada
            </label>

            <input
              type="number"
              min={2}
              value={litterCount}
              onChange={(e) => setLitterCount(Number(e.target.value))}
              className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Ação */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </section>
  );
}

