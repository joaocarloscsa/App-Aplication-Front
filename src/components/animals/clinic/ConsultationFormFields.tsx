"use client";

type Props = {
  readOnly?: boolean;

  chiefComplaint: string;
  clinicalFindings: string;
  diagnosticImpression: string;
  conduct: string;

  temperature: string;
  heartRate: string;
  respiratoryRate: string;
  weight: string;

  onChange?: {
    chiefComplaint(v: string): void;
    clinicalFindings(v: string): void;
    diagnosticImpression(v: string): void;
    conduct(v: string): void;

    temperature(v: string): void;
    heartRate(v: string): void;
    respiratoryRate(v: string): void;
    weight(v: string): void;
  };
};

export function ConsultationFormFields({
  readOnly = false,

  chiefComplaint,
  clinicalFindings,
  diagnosticImpression,
  conduct,

  temperature,
  heartRate,
  respiratoryRate,
  weight,

  onChange,
}: Props) {
  const textareaClass =
    "w-full rounded border px-3 py-2 text-sm resize-y min-h-[80px]";

  const inputClass =
    "w-full rounded border px-3 py-2 text-sm";

  return (
    <div className="space-y-5">

      {/* QUEIXA */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Queixa principal
        </label>

        <textarea
          className={textareaClass}
          value={chiefComplaint}
          readOnly={readOnly}
          onChange={(e) => onChange?.chiefComplaint(e.target.value)}
        />
      </div>

      {/* EXAME CLÍNICO */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Exame clínico
        </label>

        <textarea
          className={textareaClass}
          value={clinicalFindings}
          readOnly={readOnly}
          onChange={(e) => onChange?.clinicalFindings(e.target.value)}
        />
      </div>

      {/* SINAIS VITAIS */}
      <div className="grid grid-cols-2 gap-3">

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            Temperatura (°C)
          </label>

          <input
            className={inputClass}
            value={temperature}
            readOnly={readOnly}
            onChange={(e) => onChange?.temperature(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            Frequência cardíaca
          </label>

          <input
            className={inputClass}
            value={heartRate}
            readOnly={readOnly}
            onChange={(e) => onChange?.heartRate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            Frequência respiratória
          </label>

          <input
            className={inputClass}
            value={respiratoryRate}
            readOnly={readOnly}
            onChange={(e) => onChange?.respiratoryRate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
            Peso (kg)
          </label>

          <input
            className={inputClass}
            value={weight}
            readOnly={readOnly}
            onChange={(e) => onChange?.weight(e.target.value)}
          />
        </div>

      </div>

      {/* AVALIAÇÃO */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Avaliação diagnóstica
        </label>

        <textarea
          className={textareaClass}
          value={diagnosticImpression}
          readOnly={readOnly}
          onChange={(e) => onChange?.diagnosticImpression(e.target.value)}
        />
      </div>

      {/* CONDUTA */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Conduta
        </label>

        <textarea
          className={textareaClass}
          value={conduct}
          readOnly={readOnly}
          onChange={(e) => onChange?.conduct(e.target.value)}
        />
      </div>
    </div>
  );
}
