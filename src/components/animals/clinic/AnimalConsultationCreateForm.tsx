// path: src/components/animals/clinic/AnimalConsultationCreateForm.tsx

"use client";

import { useState } from "react";
import { createAnimalConsultation } from "@/services/animalConsultations";
import { useRouter } from "next/navigation";

type Props = {
  animalPublicId: string;
  onCreated(publicId: string): Promise<void> | void;
  onCancel(): void;
};

export function AnimalConsultationCreateForm({
  animalPublicId,
  onCreated,
  onCancel,
}: Props) {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosticImpression, setDiagnosticImpression] = useState("");
  const [conduct, setConduct] = useState("");

  const [clinicalFindings, setClinicalFindings] = useState("");
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [weight, setWeight] = useState("");

  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  });

  const [type, setType] = useState("ROUTINE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

async function submit() {
  setError(null);

  if (!chiefComplaint.trim()) {
    setError("A queixa principal é obrigatória.");
    return;
  }

  if (!diagnosticImpression.trim()) {
    setError("A avaliação diagnóstica é obrigatória.");
    return;
  }

  if (!conduct.trim()) {
    setError("A conduta é obrigatória.");
    return;
  }

  if (!dateTime) {
    setError("A data da consulta é obrigatória.");
    return;
  }

  try {
    setLoading(true);

    const result = await createAnimalConsultation(animalPublicId, {
      type,
      date_time: new Date(dateTime).toISOString(),
      chief_complaint: chiefComplaint,
      diagnostic_impression: diagnosticImpression,
      conduct,
      clinical_findings: clinicalFindings || null,
      temperature: temperature ? Number(temperature) : null,
      heart_rate: heartRate ? Number(heartRate) : null,
      respiratory_rate: respiratoryRate ? Number(respiratoryRate) : null,
      weight: weight ? Number(weight) : null,
    });

   await onCreated(result.public_id);

    if (result?.public_id) {
      router.push(
        `/dashboard/animals/${animalPublicId}/clinic/consultations/${result.public_id}`
      );
    }

  } catch {
    setError("Erro ao registrar consulta.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="rounded-lg border bg-white p-4 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Nova consulta clínica
        </h3>

        <p className="text-xs text-zinc-500">
          Registre a consulta que originou a avaliação clínica do animal.
        </p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Tipo */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Tipo de consulta
        </label>

        <select
          className="w-full rounded border px-3 py-2 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="INITIAL">Inicial</option>
          <option value="RETURN">Retorno</option>
          <option value="REEVALUATION">Reavaliação</option>
          <option value="ROUTINE">Rotina</option>
          <option value="URGENT">Urgência</option>
        </select>
      </div>

      {/* Data */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Data e hora
        </label>

        <input
          type="datetime-local"
          className="w-full rounded border px-3 py-2 text-sm"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>

      {/* Queixa */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Queixa principal
        </label>

        <textarea
          rows={2}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Motivo da consulta (ex: coceira intensa, vômitos, falta de apetite)"
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
        />
      </div>

      {/* Exame clínico */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Exame clínico
        </label>

        <textarea
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Achados do exame físico"
          value={clinicalFindings}
          onChange={(e) => setClinicalFindings(e.target.value)}
        />
      </div>

      {/* Sinais vitais */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-700">
            Temperatura (°C)
          </label>

          <input
            type="number"
            step="0.1"
            className="w-full rounded border px-3 py-2 text-sm"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-700">
            Frequência cardíaca
          </label>

          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-sm"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-700">
            Frequência respiratória
          </label>

          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-sm"
            value={respiratoryRate}
            onChange={(e) => setRespiratoryRate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-700">
            Peso (kg)
          </label>

          <input
            type="number"
            step="0.01"
            className="w-full rounded border px-3 py-2 text-sm"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      {/* Avaliação */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Avaliação diagnóstica
        </label>

        <textarea
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Impressão diagnóstica ou hipóteses"
          value={diagnosticImpression}
          onChange={(e) => setDiagnosticImpression(e.target.value)}
        />
      </div>

      {/* Conduta */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Conduta
        </label>

        <textarea
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Tratamentos, exames solicitados ou orientações"
          value={conduct}
          onChange={(e) => setConduct(e.target.value)}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-zinc-600"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white"
        >
          Registrar consulta
        </button>
      </div>
    </div>
  );
}