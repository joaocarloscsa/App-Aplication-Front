"use client";

import { useMemo, useState } from "react";
import { createClinicalExamOrder } from "@/services/clinicalExamOrders";
import { useModal } from "@/components/ui/modal/ModalProvider";
import type { ClinicalExamOrderPriority } from "@/types/clinicalExamOrders";

type Props = {
  consultationPublicId: string;
  onCreated(): Promise<void> | void;
  problemIds?: string[];
};

export function AnimalExamOrderCreateForm({
  consultationPublicId,
  onCreated,
  problemIds = [],
}: Props) {
  const { confirm } = useModal();

  const [open, setOpen] = useState(false);
  const [examType, setExamType] = useState("");
  const [justification, setJustification] = useState("");
  const [diagnosticHypothesis, setDiagnosticHypothesis] = useState("");
  const [priority, setPriority] =
    useState<ClinicalExamOrderPriority>("ROUTINE");
  const [laboratory, setLaboratory] = useState("");
  const [parametersText, setParametersText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parameters = useMemo(() => {
    return parametersText
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }, [parametersText]);

  async function submit() {
    setError(null);

    if (!examType.trim()) {
      setError("O tipo de exame é obrigatório.");
      return;
    }

    if (!justification.trim()) {
      setError("A justificativa clínica é obrigatória.");
      return;
    }

    try {
      setLoading(true);

      await createClinicalExamOrder(consultationPublicId, {
        exam_type: examType.trim(),
        justification: justification.trim(),
        diagnostic_hypothesis: diagnosticHypothesis.trim() || null,
        priority,
        laboratory: laboratory.trim() || null,
        parameters,
        problem_ids: problemIds,
      });

      setExamType("");
      setJustification("");
      setDiagnosticHypothesis("");
      setPriority("ROUTINE");
      setLaboratory("");
      setParametersText("");
      setOpen(false);

      await onCreated();

      await confirm({
        title: "Pedido registrado",
        message: "O pedido de exame foi criado com sucesso.",
        confirmLabel: "OK",
        hideCancel: true,
      });
    } catch (e: any) {
      setError(e?.message || "Erro ao criar pedido de exame.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-zinc-700 hover:underline"
      >
        + Solicitar exame
      </button>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            Novo pedido de exame
          </p>
          <p className="text-xs text-zinc-500">
            Pedido vinculado a esta consulta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-zinc-500 hover:underline"
        >
          Cancelar
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Tipo de exame *
        </label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          placeholder="Ex: Hemograma, Bioquímica, Radiografia..."
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Justificativa clínica *
        </label>
        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          rows={3}
          placeholder="Motivo clínico para solicitar este exame"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Hipótese diagnóstica (opcional)
        </label>
        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          value={diagnosticHypothesis}
          onChange={(e) => setDiagnosticHypothesis(e.target.value)}
          rows={2}
          placeholder="Ex: suspeita de insuficiência renal..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-700">
            Prioridade
          </label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as ClinicalExamOrderPriority)
            }
          >
            <option value="ROUTINE">Rotina</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-700">
            Laboratório (opcional)
          </label>
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            value={laboratory}
            onChange={(e) => setLaboratory(e.target.value)}
            placeholder="Ex: Lab X"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Parâmetros (opcional)
        </label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          value={parametersText}
          onChange={(e) => setParametersText(e.target.value)}
          placeholder="Ex: ureia, creatinina, ALT"
        />
        <p className="text-[11px] text-zinc-500">
          Use vírgulas para separar.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-600"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Registrar pedido
        </button>
      </div>
    </div>
  );
}