"use client";

import { useEffect, useState } from "react";
import {
  listAnimalClinicalProblems,
  linkClinicalConsultationToProblem,
  ClinicalProblemSummaryDTO,
} from "@/services/clinicalProblems";

type Props = {
  animalPublicId: string;
  consultationPublicId: string;
  alreadyLinked?: string[];
  onLinked(): void;
};

export function ProblemLinkForm({
  animalPublicId,
  consultationPublicId,
  alreadyLinked,
  onLinked,
}: Props) {

  const [items, setItems] = useState<ClinicalProblemSummaryDTO[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {

    async function load() {

      const all = await listAnimalClinicalProblems(animalPublicId);

const filtered = all.filter(
  (p) => !(alreadyLinked ?? []).includes(p.public_id)
);

      setItems(filtered);
    }

    load();

  }, [animalPublicId, alreadyLinked]);

  async function submit() {

    if (!selected) return;

    await linkClinicalConsultationToProblem(
      selected,
      consultationPublicId
    );

    setSelected("");

    onLinked();
  }

  return (
    <div className="border rounded p-3 space-y-3">

      <select
        className="w-full border rounded px-3 py-2 text-sm"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >

        <option value="">
          Selecione um problema existente
        </option>

        {items.map((p) => (
          <option key={p.public_id} value={p.public_id}>
            {p.title}
          </option>
        ))}

      </select>

      <button
        onClick={submit}
        className="text-xs bg-zinc-900 text-white px-3 py-1 rounded"
      >
        Associar problema
      </button>

    </div>
  );
}