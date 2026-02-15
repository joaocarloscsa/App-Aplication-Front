// src/app/(protected)/dashboard/animals/[animalId]/clinic/layout.tsx
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

  const base = `/dashboard/animals/${animalId}/clinic`;

  const items = [
    { key: "overview", label: "Visão clínica", href: base },
    { key: "medications", label: "Medicações", href: `${base}/medications` },
    // futuros:
    // { key: "vaccines", label: "Vacinas", href: `${base}/vaccines` },
    // { key: "treatments", label: "Tratamentos", href: `${base}/treatments` },
    // { key: "exams", label: "Exames", href: `${base}/exams` },
  ];

  return (
    <section className="space-y-6">
      {/* MENU CLÍNICO — DESKTOP */}
      <nav className="hidden sm:block border-b border-zinc-200">
        <ul className="flex gap-6 text-sm">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center gap-1 pb-2 transition-colors",
                    active
                      ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                      : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900",
                  ].join(" ")}
                >
                  <span className="w-4 text-xs">
                    {active ? "🐾" : ""}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MENU CLÍNICO — MOBILE */}
      <div className="sm:hidden relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-zinc-800"
      >
        🐾 Clínica
        <span className="ml-auto text-xs">{open ? "▲" : "▼"}</span>
      </button>


        {open && (
          <div className="absolute z-10 mt-2 w-56 rounded-md border bg-white shadow">
            {items.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-2 px-4 py-2 text-sm",
                    active
                      ? "bg-zinc-100 font-semibold"
                      : "hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <span className="w-4 text-xs">
                    {active ? "🐾" : ""}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTEÚDO */}
      {children}
    </section>
  );
}
