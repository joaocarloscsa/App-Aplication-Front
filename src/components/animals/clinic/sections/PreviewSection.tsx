"use client";

import { TreatmentScheduleForm } from "../hooks/useTreatmentScheduleForm";

type Props = {
  form: TreatmentScheduleForm;
};

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("pt-PT");
}

export function PreviewSection({ form }: Props) {
  const model = form.previewModel;

  if (!form.startsAt) return null;

  return (
    <div className="bg-zinc-50 border rounded p-3 text-xs">
      <p className="font-semibold mb-2">Preview (datas)</p>

      {model.kind === "count" && (
        <>
          <ul className="list-disc ml-4 space-y-1">
            {/* Primeiras datas */}
            {model.firstDates.map((d, i) => (
              <li key={i}>
                {formatDate(d)} — horários: {form.times.join(", ")}
              </li>
            ))}

            {/* Se houver mais ocorrências além das primeiras */}
            {model.total > model.firstDates.length + 1 && (
              <li className="text-zinc-500 italic">
                … (mais {model.total - model.firstDates.length - 1} ocorrências)
              </li>
            )}

            {/* Última data */}
            {model.lastDate && (
              <li>
                {formatDate(model.lastDate)} — horários:{" "}
                {form.times.join(", ")} (última)
              </li>
            )}
          </ul>

          <div className="mt-2 text-zinc-600">
            Total de ocorrências: {model.total}
            <br />
            Termina em: {formatDate(model.endsAtIso)}
          </div>
        </>
      )}

      {model.kind === "until" && (
        <>
          <ul className="list-disc ml-4 space-y-1">
            {model.dates.map((d, i) => (
              <li key={i}>
                {formatDate(d)} — horários: {form.times.join(", ")}
              </li>
            ))}
          </ul>

          <div className="mt-2 text-zinc-600">
            Termina em: {formatDate(model.untilIso)}
          </div>
        </>
      )}

      {model.kind === "until_missing" && (
        <p className="italic text-zinc-500">
          Selecione a data final para gerar preview.
        </p>
      )}
    </div>
  );
}