"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createClinicalExamOrder,
  listClinicalExamTypes,
} from "@/services/clinicalExamOrders";
import { useModal } from "@/components/ui/modal/ModalProvider";

import type {
  ClinicalExamOrderPriority,
  ClinicalExamTypeItem,
} from "@/types/clinicalExamOrders";

type Props = {
  consultationPublicId: string;
  animalPublicId?: string;
  onCreated(): Promise<void> | void;
};

export function AnimalExamOrderCreateForm({
  consultationPublicId,
  onCreated,
}: Props) {
  const { confirm } = useModal();

  const [open, setOpen] = useState(false);

  const [examTypes, setExamTypes] = useState<ClinicalExamTypeItem[]>([]);
  const [selectedExamTypes, setSelectedExamTypes] = useState<string[]>([""]);

  const [justification, setJustification] = useState("");
  const [diagnosticHypothesis, setDiagnosticHypothesis] = useState("");
  const [notes, setNotes] = useState("");

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

  useEffect(() => {
    listClinicalExamTypes()
      .then((res) => {
        const items = res.items ?? [];

        // evita tipos inativos se backend enviar flag
        const filtered = items.filter((i: any) =>
          i.active === undefined ? true : i.active === true
        );

        setExamTypes(filtered);
      })
      .catch(() => setExamTypes([]));
  }, []);

  function addExamType() {
    setSelectedExamTypes((prev) => [...prev, ""]);
  }

  function updateExamType(index: number, value: string) {
    setSelectedExamTypes((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  function removeExamType(index: number) {
    setSelectedExamTypes((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function submit() {
    setError(null);

    const examTypesFiltered = selectedExamTypes.filter(Boolean);

    if (examTypesFiltered.length === 0) {
      setError("Adicione pelo menos um exame.");
      return;
    }

    if (!justification.trim()) {
      setError("A justificativa clínica é obrigatória.");
      return;
    }

    try {
      setLoading(true);

      await createClinicalExamOrder(consultationPublicId, {
        exam_types: examTypesFiltered,
        justification: justification.trim(),
        diagnostic_hypothesis: diagnosticHypothesis.trim() || null,
        notes: notes.trim() || null,
        priority,
        laboratory: laboratory.trim() || null,
        parameters,
      });

      setSelectedExamTypes([""]);
      setJustification("");
      setDiagnosticHypothesis("");
      setNotes("");
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
      setError(e?.message || "Erro ao criar pedido.");
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
            Pedido vinculado à consulta
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-700">
            Exames solicitados
          </label>

          <button
            type="button"
            onClick={addExamType}
            className="text-xs text-blue-600 hover:underline"
          >
            + Adicionar exame
          </button>
        </div>

        {selectedExamTypes.map((value, index) => (
          <div key={index} className="flex gap-2">
            <select
              className="w-full rounded border px-3 py-2 text-sm"
              value={value}
              onChange={(e) => updateExamType(index, e.target.value)}
            >
              <option value="">Selecione o exame</option>

              {examTypes.map((type) => (
                <option key={type.public_id} value={type.public_id}>
                  {type.name} — {type.category.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => removeExamType(index)}
              className="text-xs text-red-600"
            >
              remover
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Justificativa clínica
        </label>

        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Hipótese diagnóstica
        </label>

        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          value={diagnosticHypothesis}
          onChange={(e) => setDiagnosticHypothesis(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-700">
          Observação clínica
        </label>

        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-700">
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
          <label className="text-xs font-medium text-zinc-700">
            Laboratório
          </label>

          <input
            className="w-full rounded border px-3 py-2 text-sm"
            value={laboratory}
            onChange={(e) => setLaboratory(e.target.value)}
          />
        </div>
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