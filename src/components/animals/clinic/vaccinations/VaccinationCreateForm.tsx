"use client"

import { useEffect, useMemo, useState } from "react"
import { createAnimalVaccination } from "@/services/animalVaccinations"
import { useVaccineCatalog } from "@/hooks/useVaccineCatalog"
import { useModal } from "@/components/ui/modal/ModalProvider"
import type { CreateAnimalVaccinationResponse } from "@/services/animalVaccinations"


type Props = {
  animalPublicId: string
  animalType: string
  onCreated(response: CreateAnimalVaccinationResponse): Promise<void> | void
  onCancel(): void
}

type ManualDoseOption = {
  value: number
  label: string
}

const MANUAL_DOSE_OPTIONS: ManualDoseOption[] = [
  { value: 1, label: "1ª dose (filhote)" },
  { value: 2, label: "2ª dose" },
  { value: 3, label: "3ª dose" },
  { value: 4, label: "Reforço" },
  { value: 5, label: "Revacinação" },
  { value: 6, label: "Reinício de protocolo" }
]

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatDatePt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-PT")
}

function buildDoseLabel(doseNumber: number, totalDoses: number): string {
  if (totalDoses <= 1) return "Dose única"
  if (doseNumber === 1) return "1ª dose"
  if (doseNumber === 2) return "2ª dose"
  if (doseNumber === 3) return "3ª dose"
  return `${doseNumber}ª dose`
}

function buildProtocolTypeLabel(protocolType?: string): string {
  switch ((protocolType ?? "").toLowerCase()) {
    case "initial":
      return "Protocolo inicial"
    case "booster":
      return "Reforço"
    case "recurrent":
      return "Reforço recorrente"
    default:
      return "Protocolo"
  }
}

function getProtocolType(protocol: unknown): string | undefined {
  if (!protocol || typeof protocol !== "object") {
    return undefined
  }

  const typed = protocol as {
    type?: string
    protocol_type?: string
  }

  return typed.protocol_type ?? typed.type
}

function getProtocolId(protocol: unknown): number | undefined {
  if (!protocol || typeof protocol !== "object") {
    return undefined
  }

  const typed = protocol as {
    id?: unknown
  }

  return typeof typed.id === "number" ? typed.id : undefined
}

function getProtocolTypeLabelWithoutProtocol(doseNumber: number): string {
  const option = MANUAL_DOSE_OPTIONS.find((item) => item.value === doseNumber)
  return option?.label ?? "Dose manual"
}

export function VaccinationCreateForm({
  animalPublicId,
  animalType,
  onCreated,
  onCancel
}: Props) {
  const {
    manufacturers,
    vaccines,
    loadVaccines,
    loadingManufacturers,
    loadingVaccines
  } = useVaccineCatalog(animalType)

  const today = new Date().toISOString().slice(0, 10)

  const [manufacturerId, setManufacturerId] = useState<number | null>(null)
  const [productCode, setProductCode] = useState("")
  const [protocolIndex, setProtocolIndex] = useState<number | null>(null)
  const [doseNumber, setDoseNumber] = useState(1)

  const [appliedAt, setAppliedAt] = useState(today)
  const { confirm } = useModal()
  const [appliedTime, setAppliedTime] = useState(() => {

    const now = new Date()

    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  })

  const [nextDoseAt, setNextDoseAt] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [notes, setNotes] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedVaccine = useMemo(
    () => vaccines.find((v) => v.code === productCode),
    [vaccines, productCode]
  )

  const selectedProtocol = useMemo(
    () =>
      protocolIndex !== null
        ? selectedVaccine?.protocols?.[protocolIndex]
        : undefined,
    [selectedVaccine, protocolIndex]
  )

  const selectedProtocolId = useMemo(
    () => getProtocolId(selectedProtocol),
    [selectedProtocol]
  )

  const selectedProtocolType = useMemo(
    () => getProtocolType(selectedProtocol),
    [selectedProtocol]
  )

  const hasProtocols = (selectedVaccine?.protocols?.length ?? 0) > 0

  const maxDoseCount =
    selectedProtocol?.dose_count ??
    selectedProtocol?.doses?.length ??
    1

  const doseOptions = useMemo(() => {

    if (!selectedProtocol) {
      return MANUAL_DOSE_OPTIONS
    }

    return Array.from({ length: maxDoseCount }, (_, index) => {
      const value = index + 1

      return {
        value,
        label: buildDoseLabel(value, maxDoseCount)
      }
    })

  }, [selectedProtocol, maxDoseCount])







  const protocolPreview = useMemo(() => {

    if (!selectedProtocol) {
      return []
    }

    const items: Array<{
      key: string
      title: string
      subtitle: string
      kind: "dose" | "booster"
      active: boolean
    }> = []

    // NOVO MODELO COM doses[]
    if (selectedProtocol.doses?.length) {

      selectedProtocol.doses.forEach((dose) => {

        const minWeeks = dose.min_age_days
          ? Math.floor(dose.min_age_days / 7)
          : null

        const idealWeeks = dose.recommended_age_days
          ? Math.floor(dose.recommended_age_days / 7)
          : null

        const maxWeeks = dose.max_age_days
          ? Math.floor(dose.max_age_days / 7)
          : null

        const subtitleParts: string[] = []

        if (minWeeks) subtitleParts.push(`mín: ${minWeeks} sem`)
        if (idealWeeks) subtitleParts.push(`ideal: ${idealWeeks} sem`)
        if (maxWeeks) subtitleParts.push(`máx: ${maxWeeks} sem`)

        items.push({
          key: `dose-${dose.dose_number}`,
          title: `Dose ${dose.dose_number}`,
          subtitle: subtitleParts.join(" • "),
          kind: "dose",
          active: dose.dose_number === doseNumber
        })

      })

    }

    // FALLBACK para protocolos antigos
    else {

      const total = maxDoseCount ?? 1
      const interval = selectedProtocol.interval_days ?? 0

      for (let index = 1; index <= total; index++) {

        let subtitle = ""

        if (index > 1 && interval > 0) {
          subtitle = `+${interval * (index - 1)} dias`
        }

        items.push({
          key: `dose-${index}`,
          title: `Dose ${index}`,
          subtitle,
          kind: "dose",
          active: index === doseNumber
        })

      }

    }

    if (
      selectedProtocol.booster_interval_days &&
      selectedProtocol.booster_interval_days > 0
    ) {

      items.push({
        key: "booster",
        title: "Reforço",
        subtitle: `a cada ${selectedProtocol.booster_interval_days} dias`,
        kind: "booster",
        active: false
      })

    }

    return items

  }, [selectedProtocol, doseNumber])











  useEffect(() => {

    if (!selectedProtocol) {
      setNextDoseAt("")
      return
    }

    if (doseNumber > maxDoseCount) {
      setDoseNumber(1)
    }

  }, [selectedProtocol])

  useEffect(() => {
    if (!selectedProtocol) {
      setNextDoseAt("")
      return
    }

    if (doseNumber < maxDoseCount) {
      if (selectedProtocol.interval_days > 0) {
        setNextDoseAt(addDays(appliedAt, selectedProtocol.interval_days))
        return
      }

      setNextDoseAt("")
      return
    }

    if (
      selectedProtocol.booster_interval_days &&
      selectedProtocol.booster_interval_days > 0
    ) {
      setNextDoseAt(addDays(appliedAt, selectedProtocol.booster_interval_days))
      return
    }

    setNextDoseAt("")
  }, [selectedProtocol, doseNumber, appliedAt])

  async function handleManufacturerChange(value: string) {
    if (value === "") {
      setManufacturerId(null)
      setProductCode("")
      setProtocolIndex(null)
      setDoseNumber(1)
      setNextDoseAt("")
      setError(null)
      return
    }

    const id = Number(value)

    setManufacturerId(id)
    setProductCode("")
    setProtocolIndex(null)
    setDoseNumber(1)
    setNextDoseAt("")
    setError(null)

    await loadVaccines(id)
  }

async function submit() {
  if (!manufacturerId) {
    setError("Selecione o fabricante.")
    return
  }

  if (!productCode) {
    setError("Selecione a vacina.")
    return
  }

  if (doseNumber < 1) {
    setError("Selecione a dose.")
    return
  }

  if (!selectedVaccine) {
    setError("Vacina inválida.")
    return
  }

  try {
    setLoading(true)
    setError(null)

    const appliedDateTime = new Date(`${appliedAt}T00:00:00`)

    if (appliedTime) {
      const [h, m] = appliedTime.split(":")
      appliedDateTime.setHours(Number(h), Number(m), 0, 0)
    } else {
      appliedDateTime.setHours(0, 0, 0, 0)
    }

    const classificationNote = selectedProtocol
      ? `${buildDoseLabel(doseNumber, maxDoseCount)} — ${selectedProtocol?.name ?? "Protocolo"}`
      : getProtocolTypeLabelWithoutProtocol(doseNumber)

    const mergedNotes = [classificationNote, notes.trim()]
      .filter(Boolean)
      .join(" | ")

    const response = await createAnimalVaccination(animalPublicId, {
      product_code: selectedVaccine.code,
      protocol_id: selectedProtocolId,
      dose_number: doseNumber,
      applied_at: appliedDateTime.toISOString(),
      expiration_date: expirationDate
        ? new Date(expirationDate).toISOString()
        : undefined,
      // ⚠️ ideal: remover isso se backend for source of truth
      next_dose_at: nextDoseAt
        ? new Date(nextDoseAt).toISOString()
        : undefined,
      notes: mergedNotes || undefined
    })

    const nextDose = response?.next_dose
    const task = response?.task

    await confirm({
      title: "Vacinação registrada",
      message: [
        nextDose
          ? `📅 Próxima dose: ${new Date(nextDose.scheduled_at).toLocaleDateString("pt-PT")}`
          : "📅 Sem próxima dose definida",

        task?.created
          ? "✅ Tarefa criada automaticamente"
          : task?.exists
            ? "ℹ️ Tarefa já existia"
            : "⚠️ Nenhuma tarefa gerada",

        expirationDate
          ? `🧪 Validade da vacina: ${formatDatePt(expirationDate)}`
          : null
      ]
        .filter(Boolean)
        .join("\n"),
      confirmLabel: "OK",
      hideCancel: true
    })

    await onCreated(response)

  } catch {
    setError("Erro ao registrar vacinação.")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            Registrar vacinação
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Selecione a vacina, o protocolo e a classificação da dose para registrar a aplicação.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Fabricante
          </label>

          <select
            value={manufacturerId ?? ""}
            onChange={(e) => {
              void handleManufacturerChange(e.target.value)
            }}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            disabled={loading || loadingManufacturers}
          >
            <option value="">
              {loadingManufacturers ? "Carregando fabricantes..." : "Selecionar fabricante"}
            </option>

            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Vacina
          </label>

          <select
            value={productCode}
            onChange={(e) => {
              setProductCode(e.target.value)
            }}
            disabled={manufacturerId === null || loading || loadingVaccines}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 disabled:bg-zinc-50"
          >
            <option value="">
              {loadingVaccines ? "Carregando vacinas..." : "Selecionar vacina"}
            </option>

            {vaccines.map((vaccine) => (
              <option key={vaccine.code} value={vaccine.code}>
                {vaccine.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Protocolo
          </label>

          <select
            value={protocolIndex ?? ""}
            onChange={(e) => {
              const value = e.target.value
              setProtocolIndex(value === "" ? null : Number(value))
            }}
            disabled={!selectedVaccine || loading}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 disabled:bg-zinc-50"
          >
            <option value="">
              {hasProtocols ? "Selecionar protocolo" : "Sem protocolos"}
            </option>

            {selectedVaccine?.protocols?.map((protocol, index) => (
              <option key={`${protocol.name}-${index}`} value={index}>
                {protocol.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {hasProtocols ? "Dose atual" : "Classificação da dose"}
          </label>

          <select
            value={doseNumber}
            onChange={(e) => {
              setDoseNumber(Number(e.target.value))
            }}
            disabled={!selectedVaccine || loading}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 disabled:bg-zinc-50"
          >
            {doseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedVaccine && (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {selectedVaccine.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {selectedVaccine.manufacturer}
                </p>
              </div>

              {selectedProtocol && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {buildProtocolTypeLabel(selectedProtocolType)}
                </span>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Doenças cobertas
              </p>

              {selectedVaccine.diseases?.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedVaccine.diseases.map((disease) => (
                    <span
                      key={disease}
                      className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700"
                    >
                      {disease}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  Doenças não especificadas.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {selectedProtocol ? "Preview do protocolo" : "Orientação clínica"}
            </p>

            {!selectedProtocol ? (
              <div className="space-y-2">
                <p className="text-sm text-zinc-500">
                  Esta vacina não possui protocolo configurado no catálogo.
                </p>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Selecione manualmente a classificação da dose: 1ª, 2ª, 3ª, reforço, revacinação ou reinício de protocolo.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {protocolPreview.map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${item.active
                      ? "border-blue-200 bg-blue-50 text-blue-900"
                      : "border-zinc-200 bg-white text-zinc-700"
                      }`}
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.subtitle}</p>
                    </div>

                    {item.kind === "booster" &&
                      selectedProtocol?.booster_interval_days === 365 && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          Anual
                        </span>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Data da vacinação
          </label>

          <input
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Hora da aplicação
          </label>

          <input
            type="time"
            value={appliedTime}
            onChange={(e) => setAppliedTime(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Próxima dose prevista
          </label>

          <input
            type="date"
            value={nextDoseAt}
            onChange={(e) => setNextDoseAt(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Lote da vacina
          </label>

          <input
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="Ex: A42K9"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Validade da vacina
          </label>

          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            disabled={loading}
          />
        </div>
      </div>

      {selectedProtocol && (
        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Tipo
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {buildProtocolTypeLabel(selectedProtocolType)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Dose selecionada
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {buildDoseLabel(doseNumber, maxDoseCount)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Total de doses
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {maxDoseCount}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Próxima previsão
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {nextDoseAt ? formatDatePt(nextDoseAt) : "Sem próxima dose"}
              </p>
            </div>
          </div>
        </div>
      )}

      {!selectedProtocol && selectedVaccine && (
        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Classificação
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {getProtocolTypeLabelWithoutProtocol(doseNumber)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Próxima previsão
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {nextDoseAt ? formatDatePt(nextDoseAt) : "Definir manualmente"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Modo
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                Registro manual sem protocolo
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Observações
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
          placeholder="Observações clínicas da aplicação"
          disabled={loading}
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          disabled={loading}
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </div>
    </div>
  )
}