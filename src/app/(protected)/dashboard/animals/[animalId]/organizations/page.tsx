// src/app/(protected)/dashboard/animals/[animalId]/organizations/page.tsx

/**
 * PÁGINA: Organizações com acesso ao Animal
 *
 * FINALIDADE
 * ----------
 * Representa a governança institucional do animal.
 * Mostra quais organizações tiveram ou têm acesso aos dados do animal.
 *
 * O que ENTRA aqui:
 * - Clínicas veterinárias
 * - Organizações parceiras
 * - Tipo de acesso (leitura, escrita, clínica)
 * - Períodos de acesso
 * - Histórico de concessão e revogação
 * - Quem autorizou o acesso
 *
 * RELAÇÃO COM OUTROS DOMÍNIOS
 * --------------------------
 * - Clínica: quem registrou dados médicos
 * - Agenda: quem criou eventos/compromissos
 * - Arquivos: quem subiu documentos
 *
 * IMPLEMENTAÇÃO FUTURA
 * --------------------
 * - Lista de organizações
 * - Histórico temporal
 * - Correlação com registros clínicos
 */

// src/app/(protected)/dashboard/animals/[animalId]/organizations/page.tsx

"use client";

import { useParams } from "next/navigation";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

export default function AnimalOrganizationsPage() {
  const { animalId } = useParams<{ animalId: string }>();

  return (
    <section className="space-y-6">
      <AnimalSectionMenu animalId={animalId} />

      <div>
        <h1 className="text-xl font-semibold">
          Organizações
        </h1>

        <p className="text-sm text-zinc-600">
          Organizações que possuem ou possuíram acesso a este animal.
        </p>
      </div>
    </section>
  );
}


