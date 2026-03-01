"use client";

import { useEffect, useMemo } from "react";
import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";
import { AdministrationRouteDTO } from "@/services/treatmentConfig";

type Props = {
  form: TreatmentScheduleForm;
  selectedRouteObj?: AdministrationRouteDTO;
};

function HelpTip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center align-middle group">
      <span
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-zinc-300 bg-white text-[11px] font-bold text-zinc-700 cursor-help select-none"
        aria-label="Ajuda"
      >
        ?
      </span>

      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-md border bg-white px-3 py-2 text-xs text-zinc-800 shadow-lg opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
        {text}
      </span>
    </span>
  );
}

export function DosageSection({ form, selectedRouteObj }: Props) {
  // ✅ NÃO PODE ter early return antes dos hooks.
  const rule = selectedRouteObj?.rule;
  const isProcedure = Boolean(rule?.is_procedure);

  const doseUnits = selectedRouteObj?.allowed_units ?? [];

  // ✅ Se o back-end enviar separado no futuro, usamos.
  //    Se não enviar, caímos para allowed_units pra não quebrar nada.
  const strengthUnits =
    // @ts-expect-error - campo pode não existir ainda; é intencional para compat
    (selectedRouteObj?.allowed_strength_units as typeof doseUnits | undefined) ??
    doseUnits;

  const singleDoseUnit = useMemo(
    () => (doseUnits.length === 1 ? doseUnits[0] : null),
    [doseUnits]
  );

  const singleStrengthUnit = useMemo(
    () => (strengthUnits.length === 1 ? strengthUnits[0] : null),
    [strengthUnits]
  );

  // ✅ Auto-set unidade de DOSE quando for única
  useEffect(() => {
    if (!selectedRouteObj) return;
    if (!rule?.requires_dose_unit) return;

    if (singleDoseUnit && !form.selectedUnit) {
      form.setSelectedUnit(singleDoseUnit.public_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRouteObj?.public_id, rule?.requires_dose_unit, singleDoseUnit?.public_id]);

  // ✅ Auto-set unidade de CONCENTRAÇÃO quando for única
  useEffect(() => {
    if (!selectedRouteObj) return;
    if (!rule?.allows_strength) return;

    if (singleStrengthUnit && !form.strengthUnitPublicId) {
      form.setStrengthUnitPublicId(singleStrengthUnit.public_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRouteObj?.public_id, rule?.allows_strength, singleStrengthUnit?.public_id]);

  if (!selectedRouteObj) return null;

  if (isProcedure) {
    return (
      <div className="space-y-1">
        <label className="text-xs text-zinc-600">Nome do procedimento</label>
        <input
          type="text"
          value={form.medicationName}
          onChange={(e) => form.setMedicationName(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>
    );
  }

  const showDose = Boolean(rule?.requires_dose_amount || rule?.requires_dose_unit);
  const showStrength = Boolean(rule?.allows_strength); // ✅ NÃO é obrigatório

  return (
    <div className="space-y-4 border rounded p-3 bg-zinc-50">
      {/* NOME */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-600">Nome do medicamento</label>
        <input
          type="text"
          value={form.medicationName}
          onChange={(e) => form.setMedicationName(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>

      {/* DOSE */}
      {showDose && (
        <div className="grid grid-cols-2 gap-3">
          {rule?.requires_dose_amount && (
            <div className="space-y-1">
              <label className="text-xs text-zinc-600">Quantidade</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.dosageAmount}
                onChange={(e) =>
                  form.setDosageAmount(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full rounded border px-2 py-1 text-sm"
              />
            </div>
          )}

          {rule?.requires_dose_unit && (
            <div className="space-y-1">
              <label className="text-xs text-zinc-600">Unidade</label>

              {singleDoseUnit ? (
                <div className="px-2 py-1 border rounded bg-white text-sm">
                  {singleDoseUnit.label}
                </div>
              ) : (
                <select
                  value={form.selectedUnit}
                  onChange={(e) => form.setSelectedUnit(e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                >
                  <option value="">Selecione</option>
                  {doseUnits.map((u) => (
                    <option key={u.public_id} value={u.public_id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      )}

      {/* CONCENTRAÇÃO (opcional) */}
      {showStrength && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-600">
              Concentração
              <HelpTip text="Concentração é a força do medicamento por unidade (ex.: quantidade de princípio ativo por mL ou por g). Isso evita confundir a dose (quanto administrar) com a potência do produto (o quão ‘forte’ ele é). Preencha somente se fizer sentido para a apresentação do medicamento." />
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.strengthValue}
              onChange={(e) =>
                form.setStrengthValue(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-600">
              Unidade da concentração
              <HelpTip text="Selecione a unidade usada para expressar a concentração (ex.: mg/mL, UI/mL, mg/g). Deve bater com o rótulo do medicamento. Se você não tem certeza, deixe em branco." />
            </label>

            {singleStrengthUnit ? (
              <div className="px-2 py-1 border rounded bg-white text-sm">
                {singleStrengthUnit.label}
              </div>
            ) : (
              <select
                value={form.strengthUnitPublicId}
                onChange={(e) => form.setStrengthUnitPublicId(e.target.value)}
                className="w-full rounded border px-2 py-1 text-sm"
              >
                <option value="">(opcional) — selecione</option>
                {strengthUnits.map((u) => (
                  <option key={u.public_id} value={u.public_id}>
                    {u.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}