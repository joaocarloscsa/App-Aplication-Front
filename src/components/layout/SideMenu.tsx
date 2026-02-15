"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { MENU_ITEMS, MenuItem } from "./menu.config";
import { useState } from "react";

type SideMenuProps = {
  mobile?: boolean;
};

export function SideMenu({ mobile = false }: SideMenuProps) {
  const pathname = usePathname();
  const params = useParams();
  const animalId = params?.animalId as string | undefined;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);

  function isActive(href?: string) {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function renderItem(item: MenuItem, level = 0) {
    const active = isActive(item.href);
    const isOpen = openGroups[item.key];

    if (item.isGroup) {
      return (
        <div key={item.key}>
          <button
            type="button"
            onClick={() => toggleGroup(item.key)}
            className={[
              "flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-md",
              "text-zinc-700 hover:text-zinc-900",
              level === 0 ? "font-medium" : "ml-4",
            ].join(" ")}
          >
            <span className="w-4 text-xs">
              {isOpen ? "▼" : "▶"}
            </span>
            <span>{item.label}</span>
          </button>

          {isOpen &&
            item.children?.map((child) =>
              renderItem(child, level + 1)
            )}
        </div>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href!}
        onClick={() => mobile && setOpen(false)}
        className={[
          "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
          level === 0 ? "font-medium" : "ml-4 text-zinc-600",
          active
            ? "text-zinc-900"
            : "text-zinc-600 hover:text-zinc-900",
        ].join(" ")}
      >
        <span className="w-4 text-xs">
          {active ? "🐾" : ""}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  }

  /** =========================
   *  MENU CONTEXTUAL DO ANIMAL
   *  ========================= */
  const animalMenu =
    animalId && pathname.startsWith(`/dashboard/animals/${animalId}`)
      ? [
          {
            key: "animal-root",
            label: "🐾 Nome do animal",
            href: `/dashboard/animals/${animalId}`,
          },
          {
            key: "animal-clinic",
            label: "Clínica",
            isGroup: true,
            children: [
              {
                key: "animal-clinic-overview",
                label: "Visão clínica",
                href: `/dashboard/animals/${animalId}/clinic`,
              },
              {
                key: "animal-clinic-medications",
                label: "Medicações",
                href: `/dashboard/animals/${animalId}/clinic/medications`,
              },
              {
                key: "animal-clinic-vaccines",
                label: "Vacinação",
                href: `/dashboard/animals/${animalId}/clinic/vaccination`,
              },
            ],
          },
        ]
      : [];

  const content = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {animalMenu.map((item) => renderItem(item))}
      {animalMenu.length > 0 && (
        <div className="my-2 border-t" />
      )}
      {MENU_ITEMS.map((item) => renderItem(item))}
    </nav>
  );

  if (!mobile) {
    return (
      <aside className="sticky top-14 h-[calc(100vh-56px)] w-56 shrink-0 border-r border-zinc-200 bg-white">
        {content}
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 hover:bg-zinc-100"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-56 bg-white shadow-xl">
            <div className="border-b px-4 py-3 text-sm font-semibold">
              Menu
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
