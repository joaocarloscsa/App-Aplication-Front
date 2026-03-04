// path: src/components/animals/clinic/ConsultationHeader.tsx

"use client";

type Props = {
  type: string;
  status: string;
  dateTime: string;
  createdByName?: string | null;
};

function humanizeType(type: string) {
  const map: Record<string, string> = {
    INITIAL: "Inicial",
    RETURN: "Retorno",
    REEVALUATION: "Reavaliação",
    ROUTINE: "Rotina",
    URGENT: "Urgência",
  };

  return map[type] ?? type;
}

function humanizeStatus(status: string) {
  const map: Record<string, string> = {
    OPEN: "Aberta",
    FINALIZED: "Finalizada",
    CANCELLED: "Cancelada",
  };

  return map[status] ?? status;
}

function statusBadge(status: string) {
  if (status === "OPEN") {
    return "bg-zinc-100 text-zinc-700";
  }

  if (status === "FINALIZED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "CANCELLED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-zinc-100 text-zinc-700";
}

function formatDate(date: string) {
  const d = new Date(date);

  return d.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConsultationHeader({
  type,
  status,
  dateTime,
  createdByName,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-4 border-b pb-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-900">
          Consulta clínica
        </p>

        <p className="text-sm text-zinc-600">
          {formatDate(dateTime)}
        </p>

        <p className="text-xs text-zinc-500">
          Registrado por {createdByName ?? "—"}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-zinc-500">
          {humanizeType(type)}
        </span>

        <span
          className={`rounded px-2 py-1 text-xs font-medium ${statusBadge(
            status
          )}`}
        >
          {humanizeStatus(status)}
        </span>
      </div>
    </div>
  );
}
