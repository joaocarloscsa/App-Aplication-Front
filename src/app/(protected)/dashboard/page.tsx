// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/page.tsx

"use client";

import { useMe } from "@/components/MeContext";

export default function DashboardPage() {
  const { me, loading } = useMe();

  if (loading) {
    return <p>Carregando…</p>;
  }

  if (!me) {
    // Isso nunca deveria acontecer porque o AuthGuard já protege,
    // mas é uma defesa explícita.
    return <p>Usuário não autenticado</p>;
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <section>
        <h2>Usuário</h2>
        <pre>{JSON.stringify(me.user, null, 2)}</pre>
      </section>

      <section>
        <h2>Pessoa</h2>
        <pre>{JSON.stringify(me.person, null, 2)}</pre>
      </section>

      <section>
        <h2>Alertas pendentes</h2>
        <pre>{JSON.stringify(me.alerts.pending, null, 2)}</pre>
      </section>
    </main>
  );
}

