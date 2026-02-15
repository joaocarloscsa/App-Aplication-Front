"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function ClinicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const animalId = params?.animalId as string;
  const [open, setOpen] = useState(false);

  const animalBase = `/dashboard/animals/${animalId}`;
  const clinicBase = `${animalBase}/clinic`;

  function isActive(href: string, exact = false) {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <section className="space-y-6">
      {/* MENU DO ANIMAL — DESKTOP */}
      <nav className="hidden sm:block border-b border-zinc-200">
        <ul className="flex gap-6 text-sm">

          {/* VOLTAR AO ANIMAL */}
          <li>
            <Link
              href={animalBase}
              className={[
                "flex items-center gap-1 pb-2 transition-colors",
                isActive(animalBase, true)
                  ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                  : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900",
              ].join(" ")}
            >
              🐾 Animal
            </Link>
          </li>

          {/* VISÃO CLÍNICA */}
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

          {/* MEDICAÇÕES */}
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

          {/* FUTUROS */}
          {/*
          <li>
            <Link href={`${clinicBase}/vaccines`}>Vacinas</Link>
          </li>
          */}
        </ul>
      </nav>

      {/* MENU DO ANIMAL — MOBILE */}
      <div className="sm:hidden relative">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-zinc-800"
        >
          🐾 Animal
          <span className="ml-auto text-xs">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-56 rounded-md border bg-white shadow">
            <Link
              href={animalBase}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-zinc-50"
            >
              Animal
            </Link>

            <Link
              href={clinicBase}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-zinc-50"
            >
              Clínica
            </Link>

            <Link
              href={`${clinicBase}/medications`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-zinc-50"
            >
              Medicações
            </Link>
          </div>
        )}
      </div>

      {/* CONTEÚDO */}
      {children}
    </section>
  );
}
