// path: src/components/animals/clinic/AnimalTreatmentCreateForm.tsx
"use client";

import { useState } from "react";
import { createAnimalTreatment } from "@/services/animalTreatments";

type Props = {
  animalPublicId: string;
  onCreated(): Promise<void> | void;
  onCancel(): void;
};

export function AnimalTreatmentCreateForm({
  animalPublicId,
  onCreated,
  onCancel,
}: Props) {
  const [problemTitle, setProblemTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [startsAt, setStartsAt] = useState("");

  const [actorRole, setActorRole] = useState("tutor");
  const [actorRoleSource] = useState("manual");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    if (!problemTitle.trim()) {
      setError("O problema clínico é obrigatório.");
      return;
    }

    if (!startsAt) {
      setError("A data de início é obrigatória.");
      return;
    }

    if (!notes.trim()) {
      setError(
        "É obrigatório registrar uma observação inicial sobre o problema clínico."
      );
      return;
    }

    try {
      setLoading(true);

      await createAnimalTreatment(animalPublicId, {
        name: problemTitle, // semanticamente: problema clínico
        starts_at: new Date(startsAt).toISOString(),
        actor_role_at_creation: actorRole,
        actor_role_source: actorRoleSource,
        notes, // backend pode ignorar por enquanto
      } as any);

      await onCreated();
    } catch {
      setError("Erro ao abrir tratamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Abrir tratamento
        </h3>
        <p className="text-xs text-zinc-500">
          Registre o problema clínico que originou este tratamento. As medicações
          e condutas serão adicionadas em seguida.
        </p>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Problema clínico */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Problema clínico / condição
        </label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Ex: Infecção urinária, otite, dor articular, pós-operatório"
          value={problemTitle}
          onChange={(e) => setProblemTitle(e.target.value)}
        />
        <p className="text-[11px] text-zinc-500">
          Identifique o motivo principal do tratamento. Não descreva aqui o
          medicamento.
        </p>
      </div>

      {/* Observações */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Observações iniciais
        </label>
        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          rows={4}
          placeholder="Descreva o contexto clínico, sintomas observados, avaliação inicial ou expectativa do tratamento."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="text-[11px] text-zinc-500">
          Este campo complementa o laudo da consulta e faz parte do histórico
          clínico.
        </p>
      </div>

      {/* Data de início */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Data de início
        </label>
        <input
          type="date"
          className="w-full rounded border px-3 py-2 text-sm"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
      </div>

      {/* Papel declarado */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-700">
          Papel declarado na criação
        </label>
        <select
          className="w-full rounded border px-3 py-2 text-sm"
          value={actorRole}
          onChange={(e) => setActorRole(e.target.value)}
        >
          <option value="tutor">Tutor</option>
          <option value="medico_veterinario">Médico veterinário</option>
          <option value="outro">Outro</option>
        </select>
        <p className="text-[11px] text-zinc-500">
          Informação apenas declarativa. A plataforma não valida profissão ou
          função.
        </p>
      </div>

      {/* Ações */}
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
          Abrir tratamento
        </button>
      </div>
    </div>
  );
}