"use client";

import { useParams } from "next/navigation";

export default function ConsultationPage() {

  const { consultationId } = useParams<{
    consultationId: string;
  }>();

  return (
    <div className="space-y-4">

      <h1 className="text-sm font-semibold text-zinc-900">
        Consulta clínica
      </h1>

      <p className="text-xs text-zinc-500">
        Consulta {consultationId}
      </p>

    </div>
  );
}