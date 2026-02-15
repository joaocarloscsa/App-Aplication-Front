"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function ClinicMenu() {
  const pathname = usePathname();
  const { animalId } = useParams<{ animalId: string }>();
  const [open, setOpen] = useState(false);

  const base = `/dashboard/animals/${animalId}/clinic`;

  const items = [
    { key: "overview", label: "Clínica", href: base },
    { key: "medications", label: "Medicações", href: `${base}/medications` },
  ];

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden sm:flex border-b border-zinc-200">
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
                  <span className="text-xs">
                    {active ? "🐾" : ""}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MOBILE */}
      <div className="sm:hidden relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-800"
        >
          🐾 Clínica
          <span>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-48 rounded-md border bg-white shadow">
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
                    "block px-4 py-2 text-sm",
                    active
                      ? "bg-zinc-100 font-semibold"
                      : "hover:bg-zinc-50",
                  ].join(" ")}
                >
                  {active ? "🐾 " : ""}
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

