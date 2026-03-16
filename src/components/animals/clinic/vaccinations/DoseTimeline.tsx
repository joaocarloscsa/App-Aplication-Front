"use client"

import { VaccinationDose, ProtocolDose } from "@/types/vaccination"

type Props = {
  doses: VaccinationDose[]
  protocolDoses?: ProtocolDose[]
}

function labelForDose(
  dose: VaccinationDose,
  protocol?: ProtocolDose
) {

  if (protocol) {

    const weeks =
      protocol.recommended_age_days
        ? Math.floor(protocol.recommended_age_days / 7)
        : null

    if (weeks) {
      return `Dose ${protocol.dose_number} (${weeks} sem)`
    }

    return `Dose ${protocol.dose_number}`
  }

  if (dose.dose_number) {
    return `Dose ${dose.dose_number}`
  }

  return "Dose"

}

export function DoseTimeline({

  doses,
  protocolDoses

}: Props) {

  return (

    <div className="space-y-1">

      {doses.map(dose => {

        const protocol =
          protocolDoses?.find(
            p => p.dose_number === dose.dose_number
          )

        return (

          <div
            key={dose.public_id}
            className="flex justify-between text-xs"
          >

            <span>

              {labelForDose(dose, protocol)}

            </span>

            <span>

              {dose.status === "applied" && "✔ aplicada"}

              {dose.status === "scheduled" && "⏳ agendada"}

              {dose.status === "cancelled" && "✖ cancelada"}

            </span>

          </div>

        )

      })}

    </div>

  )

}