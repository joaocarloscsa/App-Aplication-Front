// path: /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { TasksAlertSummary } from "@/components/tasks/TasksAlertSummary";
import { UserCard, StorageCard, AnimalsCard } from "@/components/dashboard";

export default function DashboardPage() {
  const router = useRouter();

  // Sem endpoint agregado (todas tarefas de todos animais) ainda.
  // Então por agora não mostramos alertas aqui (para não voltar a mock).
  const tasks: Array<{ id: number; title: string; scheduled_at: string | null; status: string }> = [];

  return (
    <div className="space-y-4">
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UserCard />
          <StorageCard />
          <AnimalsCard />
        </div>
      </section>

      <TasksAlertSummary
        tasks={tasks}
        onClick={() => router.push("/dashboard/agenda")}
      />
    </div>
  );
}

