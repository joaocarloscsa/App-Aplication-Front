// path: frontend/src/app/(protected)/dashboard/animals/litter-created/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function LitterCreatedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const litterId = searchParams.get("litter");
  const animalsParam = searchParams.get("animals");

  const animals = animalsParam
    ? animalsParam.split(",").filter(Boolean)
    : [];

  if (!litterId && animals.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-xl font-semibold text-zinc-900">
          Ninhada não encontrada
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Nenhum animal foi informado.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">
          Ninhada criada
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Os animais abaixo foram criados. Clique para editar cada um.
        </p>

        {litterId && (
          <p className="mt-2 text-xs text-zinc-500">
            ID da ninhada: <span className="font-mono">{litterId}</span>
          </p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white divide-y">
        {animals.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => router.push(`/dashboard/animals/${id}`)}
            className="w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-center justify-between"
          >
            <span className="font-mono text-sm text-zinc-800">
              {id}
            </span>
            <span className="text-xs text-zinc-500">
              Editar →
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
        Qualquer alteração feita agora é individual por animal.
      </div>
    </section>
  );
}

