// path: src/components/animals/clinic/ConsultationVitals.tsx

"use client";

type Props = {
  temperature?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  weight?: number | null;
};

function value(v?: number | null) {
  if (v === null || v === undefined) {
    return "—";
  }

  return v;
}

export function ConsultationVitals({
  temperature,
  heartRate,
  respiratoryRate,
  weight,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs text-zinc-500">Temperatura</p>
        <p className="font-medium text-zinc-900">
          {value(temperature)} °C
        </p>
      </div>

      <div>
        <p className="text-xs text-zinc-500">FC</p>
        <p className="font-medium text-zinc-900">
          {value(heartRate)}
        </p>
      </div>

      <div>
        <p className="text-xs text-zinc-500">FR</p>
        <p className="font-medium text-zinc-900">
          {value(respiratoryRate)}
        </p>
      </div>

      <div>
        <p className="text-xs text-zinc-500">Peso</p>
        <p className="font-medium text-zinc-900">
          {value(weight)} kg
        </p>
      </div>
    </div>
  );
}
