"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AnimalClinicPage() {
  const { animalId } = useParams<{ animalId: string }>();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-zinc-900">Prontuário clínico</h2>

      <div className="grid gap-3">
        <Link
          href={`/dashboard/animals/${animalId}/clinic/consultations`}
          className="rounded-lg border bg-white px-4 py-3 hover:bg-zinc-50"
        >
          <p className="text-sm font-medium text-zinc-900">Consultas</p>
          <p className="text-xs text-zinc-500">Histórico completo de consultas clínicas</p>
        </Link>

        <Link
          href={`/dashboard/animals/${animalId}/clinic/problems`}
          className="rounded-lg border bg-white px-4 py-3 hover:bg-zinc-50"
        >
          <p className="text-sm font-medium text-zinc-900">Problemas clínicos</p>
          <p className="text-xs text-zinc-500">Acompanhamento longitudinal dos problemas do animal</p>
        </Link>

        <Link
          href={`/dashboard/animals/${animalId}/clinic/orders`}
          className="rounded-lg border bg-white px-4 py-3 hover:bg-zinc-50"
        >
          <p className="text-sm font-medium text-zinc-900">Pedidos de exame</p>
          <p className="text-xs text-zinc-500">Lista longitudinal de solicitações por data</p>
        </Link>

        <Link
          href={`/dashboard/animals/${animalId}/clinic/exams`}
          className="rounded-lg border bg-white px-4 py-3 hover:bg-zinc-50"
        >
          <p className="text-sm font-medium text-zinc-900">Exames</p>
          <p className="text-xs text-zinc-500">Resultados recebidos/validados ao longo do tempo</p>
        </Link>

        <Link
          href={`/dashboard/animals/${animalId}/clinic/medications`}
          className="rounded-lg border bg-white px-4 py-3 hover:bg-zinc-50"
        >
          <p className="text-sm font-medium text-zinc-900">Medicações</p>
          <p className="text-xs text-zinc-500">Prescrições e histórico</p>
        </Link>

        <Link
          href={`/dashboard/animals/${animalId}/clinic/treatments`}
          className="rounded-lg border bg-white px-4 py-3 hover:bg-zinc-50"
        >
          <p className="text-sm font-medium text-zinc-900">Tratamentos</p>
          <p className="text-xs text-zinc-500">Condutas terapêuticas e acompanhamento</p>
        </Link>
      </div>
    </div>
  );
}