"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { getAnimal } from "@/services/animals";
import { revokeTutorFromAnimal } from "@/services/animalTutors";

import { AnimalHeader } from "@/components/animals/AnimalHeader";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

type HistoryLayoutAnimalDTO = {
  public_id: string;
  call_name?: string | null;
  photo?: unknown;
  tutors?: any;
};

export default function HistoryLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname();
  const params = useParams();
  const animalId = params?.animalId as string;

  const [animal, setAnimal] = useState<HistoryLayoutAnimalDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const animalBase = `/dashboard/animals/${animalId}`;
  const historyBase = `${animalBase}/history`;

  const reloadAnimal = useCallback(async () => {

    if (!animalId) {
      setAnimal(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getAnimal<HistoryLayoutAnimalDTO>(animalId);
      setAnimal(data);
    } finally {
      setLoading(false);
    }

  }, [animalId]);

  useEffect(() => {
    reloadAnimal();
  }, [reloadAnimal]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  if (loading || !animal) {
    return <div className="p-6 text-zinc-500">Carregando animal…</div>;
  }

  const menuItems = [
    {
      label: "Peso",
      href: `${historyBase}/weight`,
    },
    {
      label: "Alimentação",
      href: `${historyBase}/feeding`,
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 space-y-10">

      <AnimalHeader
        animal={animal}
        onRevokeTutor={async (personId) => {
          await revokeTutorFromAnimal(animal.public_id, personId);
          await reloadAnimal();
        }}
      />

      <AnimalSectionMenu animalId={animal.public_id} />

      <nav className="border-b border-zinc-200">
        <ul className="flex gap-6 text-sm">

          {menuItems.map((item) => {

            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-1 pb-2 transition-colors",
                    active
                      ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                      : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900",
                  ].join(" ")}
                >
                  {active && <span className="text-xs">🐾</span>}
                  {item.label}
                </Link>
              </li>
            );

          })}

        </ul>
      </nav>

      {children}

    </section>
  );
}

