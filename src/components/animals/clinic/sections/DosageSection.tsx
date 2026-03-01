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
  const isProcedure = Boolean(rule?.is_procedure);

  const doseUnits = selectedRouteObj.allowed_units ?? [];
  const singleUnit = doseUnits.length === 1 ? doseUnits[0] : null;

  if (isProcedure) {
    return (
      <div>
        <label className="text-xs text-zinc-600">
          Nome do procedimento
        </label>
        <input
          type="text"
          value={form.medicationName}
          onChange={(e) => form.setMedicationName(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 border rounded p-3 bg-zinc-50">
      {/* NOME */}
      <div>
        <label className="text-xs text-zinc-600">
          Nome do medicamento
        </label>
        <input
          type="text"
          value={form.medicationName}
          onChange={(e) => form.setMedicationName(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>

      {/* DOSE */}
      {(rule?.requires_dose_amount || rule?.requires_dose_unit) && (
        <div className="grid grid-cols-2 gap-3">
          {rule?.requires_dose_amount && (
            <div>
              <label className="text-xs text-zinc-600">
                Quantidade *
              </label>
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
            <div>
              <label className="text-xs text-zinc-600">
                Unidade *
              </label>

              {singleUnit ? (
                <div className="px-2 py-1 border rounded bg-white text-sm">
                  {singleUnit.label}
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

      {/* CONCENTRAÇÃO */}
      {rule?.allows_strength && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-600">
              Concentração *
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

          <div>
            <label className="text-xs text-zinc-600">
              Unidade da concentração *
            </label>

            {singleUnit ? (
              <div className="px-2 py-1 border rounded bg-white text-sm">
                mg
              </div>
            ) : (
              <input
                type="text"
                value={form.strengthUnit}
                onChange={(e) => form.setStrengthUnit(e.target.value)}
                className="w-full rounded border px-2 py-1 text-sm"
                placeholder="Ex: mg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}