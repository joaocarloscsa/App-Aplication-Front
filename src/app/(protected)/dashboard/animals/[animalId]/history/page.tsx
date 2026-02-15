// src/app/(protected)/dashboard/animals/[animalId]/history/page.tsx

/**
 * PÁGINA: Histórico de Vida do Animal
 *
 * FINALIDADE
 * ----------
 * Esta página é uma visão consolidada da vida do animal.
 * Une eventos relevantes de todos os domínios em uma timeline única.
 *
 * O que ENTRA aqui:
 * - Mudanças de tutor
 * - Mudanças de organização
 * - Eventos importantes
 * - Marcos clínicos
 *
 * O que NÃO substitui:
 * - Clínica (detalhe médico)
 * - Agenda (execução)
 *
 * IMPLEMENTAÇÃO FUTURA
 * --------------------
 * - Timeline unificada
 * - Filtros por tipo de evento
 * - Correlação temporal entre domínios
 */

// src/app/(protected)/dashboard/animals/[animalId]/history/page.tsx

"use client";

import { useParams } from "next/navigation";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

export default function AnimalHistoryPage() {
  const { animalId } = useParams<{ animalId: string }>();

  return (
    <section className="space-y-6">
      <AnimalSectionMenu animalId={animalId} />

      <div>
        <h1 className="text-xl font-semibold">
          Histórico do animal
        </h1>

        <p className="text-sm text-zinc-600">
          Linha do tempo consolidada da vida do animal.
        </p>
      </div>
    </section>
  );
}
