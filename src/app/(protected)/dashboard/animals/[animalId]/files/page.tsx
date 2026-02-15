// src/app/(protected)/dashboard/animals/[animalId]/files/page.tsx

/**
 * PÁGINA: Arquivos do Animal
 *
 * FINALIDADE
 * ----------
 * Esta página lista todos os arquivos armazenados no storage
 * associados ao animal ao longo da sua vida.
 *
 * O que ENTRA aqui:
 * - Exames digitalizados
 * - Laudos
 * - Fotos clínicas (feridas, fraturas, alergias)
 * - Documentos oficiais
 * - Uploads manuais
 *
 * Cada arquivo deve ter:
 * - Data
 * - Autor (quem enviou)
 * - Contexto (clínico, administrativo, outro)
 * - Comentários
 * - Link para o storage (AWS)
 *
 * O que NÃO entra aqui:
 * - Definição clínica (isso é Clínica)
 * - Execução de tarefas (isso é Agenda)
 *
 * RELAÇÃO COM OUTROS DOMÍNIOS
 * --------------------------
 * - Arquivos podem ser vinculados a:
 *   - registros clínicos
 *   - eventos de agenda
 *   - acessos de organizações
 *
 * IMPLEMENTAÇÃO FUTURA
 * --------------------
 * - Upload de arquivos
 * - Listagem cronológica
 * - Filtros por tipo e data
 * - Visualização inline quando possível
 */

// src/app/(protected)/dashboard/animals/[animalId]/files/page.tsx

"use client";

import { useParams } from "next/navigation";
import { AnimalSectionMenu } from "@/components/animals/AnimalSectionMenu";

export default function AnimalFilesPage() {
  const { animalId } = useParams<{ animalId: string }>();

  return (
    <section className="space-y-6">
      <AnimalSectionMenu animalId={animalId} />

      <div>
        <h1 className="text-xl font-semibold">
          Arquivos do animal
        </h1>

        <p className="text-sm text-zinc-600">
          Documentos, exames e arquivos associados a este animal.
        </p>
      </div>
    </section>
  );
}
