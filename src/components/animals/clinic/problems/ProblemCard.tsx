"use client";

import Link from "next/link";
import type { ClinicalProblemSummaryDTO } from "@/services/clinicalProblems";

type Props = {
  animalPublicId: string;
  item: ClinicalProblemSummaryDTO;
};

function statusBadge(code: string) {
  switch (code) {
    case "ACTIVE":
      return "bg-blue-100 text-blue-800";
    case "CHRONIC":
      return "bg-amber-100 text-amber-800";
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "SUSPENDED":
      return "bg-zinc-100 text-zinc-700";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProblemCard({ animalPublicId, item }: Props) {
  return (
    <Link
      href={`/dashboard/animals/${animalPublicId}/clinic/problems/${item.public_id}`}
      className="block rounded-lg border bg-white p-4 hover:bg-zinc-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-zinc-900">
            {item.title}
          </p>

          <p className="text-xs text-zinc-500">
            ID: {item.public_id}
          </p>

          <p className="text-xs text-zinc-500">
            Iniciado em {formatDate(item.started_at ?? item.created_at)}
          </p>
        </div>

        <span
          className={`rounded px-2 py-1 text-xs font-medium ${statusBadge(
            item.status.code
          )}`}
        >
          {item.status.label}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs font-medium text-zinc-500">
          Diagnóstico atual
        </p>

        <p className="text-sm text-zinc-700">
          {item.current_diagnosis?.trim() || "Ainda não definido"}
        </p>
      </div>

      {item.created_by?.name ? (
        <p className="mt-3 text-xs text-zinc-500">
          Registrado por {item.created_by.name}
        </p>
      ) : null}
    </Link>
  );
}
