// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/animals/[animalId]/clinic/layout.tsx
"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { getAnimal } from "@/services/animals";
import { revokeTutorFromAnimal } from "@/services/animalTutors";

import { AnimalHeader } from "@/components/animals/AnimalHeader";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

export default function ClinicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const animalId = params?.animalId as string;

  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const animalBase = `/dashboard/animals/${animalId}`;
  const clinicBase = `${animalBase}/clinic`;

  const reloadAnimal = useCallback(async () => {
    if (!animalId) return;
    setLoading(true);
    const data = await getAnimal(animalId);
    setAnimal(data);
    setLoading(false);
  }, [animalId]);

  useEffect(() => {
    reloadAnimal();
  }, [reloadAnimal]);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  if (loading || !animal) {
    return <div className="p-6 text-zinc-500">Carregando animal…</div>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 space-y-10">
      {/* ✅ TOPO PADRÃO DO ANIMAL (igual /animals/[animalId]) */}
      <AnimalHeader
        animal={animal}
        onRevokeTutor={async (personId) => {
          await revokeTutorFromAnimal(animal.public_id, personId);
          await reloadAnimal();
        }}
      />

      <AnimalSectionMenu animalId={animal.public_id} />

      {/* ✅ SUBMENU DA CLÍNICA (tabs internos) */}
      <nav className="border-b border-zinc-200">
        <ul className="flex gap-6 text-sm">
          <li>
            <Link
              href={clinicBase}
              className={[
                "flex items-center gap-1 pb-2 transition-colors",
                isActive(clinicBase, true)
                  ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                  : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900",
              ].join(" ")}
            >
              Clínica
            </Link>
          </li>

          <li>
            <Link
              href={`${clinicBase}/medications`}
              className={[
                "flex items-center gap-1 pb-2 transition-colors",
                isActive(`${clinicBase}/medications`)
                  ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                  : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900",
              ].join(" ")}
            >
              Medicações
            </Link>
          </li>

          <li>
            <Link
              href={`${clinicBase}/treatments`}
              className={[
                "flex items-center gap-1 pb-2 transition-colors",
                isActive(`${clinicBase}/treatments`)
                  ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                  : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900",
              ].join(" ")}
            >
              Tratamentos
            </Link>
          </li>
        </ul>
      </nav>

      {/* ✅ CONTEÚDO */}
      {children}
    </section>
  );
}