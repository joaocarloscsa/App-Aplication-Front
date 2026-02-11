// src/app/(protected)/dashboard/agenda/page.tsx

export default function AgendaPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-zinc-900">
        Agenda
      </h1>

      <p className="text-sm text-zinc-600">
        Visão geral da agenda. Aqui entrarão tarefas, eventos e compromissos.
      </p>

      {/*
        Estrutura prevista (não implementada ainda):
        - abas internas: Dia | Tarefas | Eventos
        - foco em uso diário (mobile-first)
        - nenhuma lógica de domínio aqui
      */}
    </section>
  );
}

