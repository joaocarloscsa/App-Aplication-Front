// src/app/(protected)/dashboard/animals/[animalId]/tutors/page.tsx

/**
 * PÁGINA: Tutores do Animal
 *
 * FINALIDADE
 * ----------
 * Esta página representa a governança humana do animal.
 * Mostra quem tem ou teve acesso ao animal ao longo do tempo.
 *
 * O que ENTRA aqui:
 * - Tutor principal atual
 * - Tutores convidados atuais
 * - Histórico de tutores antigos
 * - Períodos de acesso (de / até)
 * - Quem concedeu ou revogou acesso
 * - Mudanças de tutor principal
 *
 * O que NÃO entra aqui:
 * - Dados clínicos
 * - Agenda
 * - Arquivos
 *
 * IMPORTANTE
 * ----------
 * - Tutores têm impacto direto em:
 *   - quem pode executar tarefas
 *   - quem pode registrar dados
 * - Histórico é essencial para auditoria
 *
 * IMPLEMENTAÇÃO FUTURA
 * --------------------
 * - Linha do tempo de acessos
 * - Ações de convite / revogação (se permitido)
 * - Diferenciação entre tutor principal e convidado
 */

// src/app/(protected)/dashboard/animals/[animalId]/tutors/page.tsx

"use client";

import { useParams } from "next/navigation";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

export default function AnimalTutorsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  return (
    <section className="space-y-6">
      <AnimalSectionMenu animalId={animalId} />

      <div>
        <h1 className="text-xl font-semibold">
          Tutores do animal
        </h1>

        <p className="text-sm text-zinc-600">
          Tutores atuais e histórico de acesso ao animal.
        </p>
      </div>
    </section>
  );
}
