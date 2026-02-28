// path: frontend/src/components/animals/clinic/sections/DosageSection.tsx

"use client";

import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";
import { AdministrationRouteDTO } from "@/services/treatmentConfig";

type Props = {
  form: TreatmentScheduleForm;
  selectedRouteObj?: AdministrationRouteDTO;
};

export function DosageSection({ form, selectedRouteObj }: Props) {
  if (!selectedRouteObj) return null;

  const rule = selectedRouteObj.rule;

  // Procedimento: não tem dose estruturada
  const isProcedure = Boolean(rule?.is_procedure);

  return (
    <div className="space-y-3">
      {/* NOME MEDICAMENTO / PROCEDIMENTO */}
      <div>
        <label className="text-xs text-zinc-600">
          Nome do medicamento / procedimento
        </label>
        <input
          type="text"
          value={form.medicationName}
          onChange={(e) => form.setMedicationName(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          placeholder="Ex: Amoxicilina, Pomada X, Banho terapêutico..."
        />
      </div>

      {isProcedure ? null : (
        <>
          {/* DOSE */}
          {(rule?.requires_dose_amount || rule?.requires_dose_unit) && (
            <div className="grid grid-cols-2 gap-2">
              {rule?.requires_dose_amount && (
                <div>
                  <label className="text-xs text-zinc-600">Quantidade</label>
                  <input
                    type="number"
                    inputMode="decimal"
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
                <div>
                  <label className="text-xs text-zinc-600">Unidade</label>
                  <select
                    value={form.selectedUnit}
                    onChange={(e) => form.setSelectedUnit(e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="">Selecione</option>
                    {(selectedRouteObj.allowed_units ?? []).map((u) => (
                      <option key={u.public_id} value={u.public_id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* CONCENTRAÇÃO / FORÇA (ex: 300 mg por comprimido, 5 mg/mL, etc.) */}
          {rule?.allows_strength && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-600">
                  Concentração (por unidade)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={form.strengthValue}
                  onChange={(e) =>
                    form.setStrengthValue(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="Ex: 300"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-600">Unidade</label>
                <input
                  type="text"
                  value={form.strengthUnit}
                  onChange={(e) => form.setStrengthUnit(e.target.value)}
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder="Ex: mg"
                  disabled={rule?.requires_strength}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}