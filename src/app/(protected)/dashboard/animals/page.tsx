// src/app/(protected)/dashboard/animals/page.tsx

import Link from "next/link";
import AnimalsList from "./animals-list";

export default function AnimalsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            Animais
          </h1>

          <p className="text-sm text-zinc-600">
            Lista de animais disponíveis no momento.
          </p>
        </div>

        {/* AÇÃO PRIMÁRIA */}
        <Link
          href="/dashboard/animals/new"
          className="shrink-0 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          + Novo animal
        </Link>
      </div>

      {/* LISTA */}
      <AnimalsList />
    </section>
  );
}
