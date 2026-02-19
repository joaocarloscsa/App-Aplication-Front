"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { getAnimal } from "@/services/animals";

import { AnimalHeader } from "@/components/animals/AnimalHeader";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

type Props = {
  children: ReactNode;
};

export default function AnimalAgendaLayout({ children }: Props) {
  const { animalId } = useParams<{ animalId: string }>();
  const pathname = usePathname();

  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const base = `/dashboard/animals/${animalId}/agenda`;

  useEffect(() => {
    if (!animalId) return;

    async function load() {
      setLoading(true);
      const data = await getAnimal(animalId);
      setAnimal(data);
      setLoading(false);
    }

    load();
  }, [animalId]);

  function isActive(href: string) {
    return pathname === href;
  }

  if (loading || !animal) {
    return (
      <div className="p-6 text-sm text-zinc-500">
        Carregando agenda do animal…
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      {/* HEADER GLOBAL DO ANIMAL */}
      <AnimalHeader animal={animal} />

      {/* MENU DO ANIMAL */}
      <AnimalSectionMenu animalId={animal.public_id} />

      {/* MENU DA AGENDA */}
      <nav className="border-b border-zinc-200">
        <ul className="flex gap-6 text-sm">
          <li>
            <Link
              href={base}
              className={
                isActive(base)
                  ? "pb-2 border-b-2 border-zinc-900 font-semibold"
                  : "pb-2 text-zinc-500 hover:text-zinc-900"
              }
            >
              Visão geral
            </Link>
          </li>

          <li>
            <Link
              href={`${base}/tasks`}
              className={
                isActive(`${base}/tasks`)
                  ? "pb-2 border-b-2 border-zinc-900 font-semibold"
                  : "pb-2 text-zinc-500 hover:text-zinc-900"
              }
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Tarefas
              </span>
            </Link>
          </li>

          <li className="pb-2 text-zinc-400 cursor-not-allowed">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Eventos
            </span>
          </li>

          <li className="pb-2 text-zinc-400 cursor-not-allowed">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              Agendamentos
            </span>
          </li>
        </ul>
      </nav>

      {/* CONTEÚDO */}
      {children}
    </section>
  );
}
