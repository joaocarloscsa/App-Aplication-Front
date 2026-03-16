"use client"

import { AnimalVaccination } from "@/types/vaccination"
import { DoseTimeline } from "./DoseTimeline"

function formatDate(date?: string | null) {

  if (!date) return "-"

  return new Date(date).toLocaleDateString("pt-PT")

}

type Props = {
  vaccination: AnimalVaccination
  onReload?: () => void
}
export function VaccinationCard({ vaccination }: Props) {

  return (

    <div className="rounded-xl border border-zinc-200 bg-white p-4">

      <div className="flex justify-between items-start mb-2">

        <div>

          <div className="font-semibold text-sm">
            {vaccination.product_name}
          </div>

          {vaccination.manufacturer && (
            <div className="text-xs text-zinc-500">
              {vaccination.manufacturer}
            </div>
          )}

        </div>

        <div className="text-xs text-zinc-500">
          {vaccination.protocol_name ?? "Sem protocolo"}
        </div>

      </div>

      <DoseTimeline
        doses={vaccination.doses}
        protocolDoses={vaccination.protocol_doses}
      />

      <div className="mt-3 text-xs text-zinc-500 flex gap-4">

        <div>
          validade: {formatDate(vaccination.expiration_date)}
        </div>

        <div>
          criado: {formatDate(vaccination.created_at)}
        </div>

      </div>

    </div>

  )

}