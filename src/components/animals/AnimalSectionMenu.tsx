// src/components/animals/AnimalSectionMenu.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AnimalSectionMenuProps = {
  animalId: string;
  permissions?: {
    clinic?: boolean;
    agenda?: boolean;
    files?: boolean;
    tutors?: boolean;
    organizations?: boolean;
    history?: boolean;
  };
};

type Section = {
  key: string;
  label: string;
  href: (animalId: string) => string;
  permissionKey?: keyof NonNullable<
    AnimalSectionMenuProps["permissions"]
  >;
};

const SECTIONS: Section[] = [
  {
    key: "overview",
    label: "Visão geral",
    href: (id) => `/dashboard/animals/${id}`,
  },
  {
    key: "clinic",
    label: "Clínica",
    href: (id) => `/dashboard/animals/${id}/clinic`,
    permissionKey: "clinic",
  },
  {
    key: "agenda",
    label: "Agenda",
    href: (id) => `/dashboard/animals/${id}/agenda`,
    permissionKey: "agenda",
  },
  {
    key: "files",
    label: "Arquivos",
    href: (id) => `/dashboard/animals/${id}/files`,
    permissionKey: "files",
  },
  {
    key: "tutors",
    label: "Tutores",
    href: (id) => `/dashboard/animals/${id}/tutors`,
    permissionKey: "tutors",
  },
  {
    key: "organizations",
    label: "Organizações",
    href: (id) => `/dashboard/animals/${id}/organizations`,
    permissionKey: "organizations",
  },
  {
    key: "history",
    label: "Histórico",
    href: (id) => `/dashboard/animals/${id}/history`,
    permissionKey: "history",
  },
];

export function AnimalSectionMenu({
  animalId,
  permissions,
}: AnimalSectionMenuProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200">
      <ul className="flex flex-wrap gap-4 text-sm">
        {SECTIONS.map((section) => {
          if (
            section.permissionKey &&
            permissions &&
            permissions[section.permissionKey] === false
          ) {
            return null;
          }

          const href = section.href(animalId);
          const isActive =
            pathname === href ||
            (href !== `/dashboard/animals/${animalId}` &&
              pathname?.startsWith(href));

          return (
            <li key={section.key}>
              <Link
                href={href}
                className={`block pb-2 transition-colors ${
                  isActive
                    ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
                    : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

