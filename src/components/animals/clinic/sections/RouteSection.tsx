"use client";

import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";
import { AdministrationRouteDTO } from "@/services/treatmentConfig";

type Props = {
  form: TreatmentScheduleForm;
  routes: AdministrationRouteDTO[];
};

export function RouteSection({ form, routes }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-600">
        Via de administração
      </label>

      <select
        value={form.selectedRoute}
        onChange={(e) => form.setSelectedRoute(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm"
      >
        <option value="">Selecione</option>
        {routes.map((r) => (
          <option key={r.public_id} value={r.public_id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}