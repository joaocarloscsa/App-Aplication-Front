// path: src/components/animals/clinic/ConsultationNotesSection.tsx

"use client";

import { useState } from "react";
import {
  ConsultationNoteDTO,
  createConsultationNote,
} from "@/services/animalConsultations";

function typeLabel(type: string) {
  switch (type) {
    case "ADDENDUM":
      return "adendo";
    case "OBSERVATION":
      return "observação";
    case "CORRECTION":
      return "correção";
    default:
      return type;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-PT");
}

export function ConsultationNotesSection({
  consultationPublicId,
  notes,
  onCreated,
}: {
  consultationPublicId: string;
  notes: ConsultationNoteDTO[];
  onCreated: () => void;
}) {
  const [type, setType] = useState<
    "ADDENDUM" | "OBSERVATION" | "CORRECTION" | null
  >(null);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!type || !content.trim()) return;

    setLoading(true);

    try {
      await createConsultationNote(consultationPublicId, {
        type,
        content,
      });

      setContent("");
      setType(null);

      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-700">
          Observações da consulta
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setType("ADDENDUM")}
            className="text-xs px-3 py-1 bg-zinc-900 text-white rounded"
          >
            Adendo
          </button>

          <button
            onClick={() => setType("OBSERVATION")}
            className="text-xs px-3 py-1 bg-zinc-900 text-white rounded"
          >
            Observação
          </button>

          <button
            onClick={() => setType("CORRECTION")}
            className="text-xs px-3 py-1 bg-zinc-900 text-white rounded"
          >
            Correção
          </button>
        </div>
      </div>

      {/* FORM */}
      {type && (
        <div className="border rounded-lg p-3 space-y-3 bg-zinc-50">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={4}
            placeholder="Digite o texto..."
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                setType(null);
                setContent("");
              }}
              className="text-xs px-3 py-1 border rounded"
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="text-xs px-3 py-1 bg-green-600 text-white rounded"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
<div className="space-y-4">

  {(!notes || notes.length === 0) && (
    <p className="text-xs text-zinc-500">
      Nenhuma observação registrada.
    </p>
  )}

  {notes.map((n) => (

    <div
      key={n.public_id}
      className="border-l-4 border-zinc-300 pl-4 py-2 space-y-2"
    >

      <div className="text-xs uppercase font-semibold text-zinc-500">
        {typeLabel(n.type)}
      </div>

      <div className="text-xs text-zinc-600">
        {n.created_by?.name ?? "Usuário"}
      </div>

      <div className="text-xs text-zinc-500">
        {formatDate(n.created_at)}
      </div>

      <div className="text-sm text-zinc-900 whitespace-pre-line">
        {n.content}
      </div>

    </div>

  ))}

</div>

    </section>
  );
}