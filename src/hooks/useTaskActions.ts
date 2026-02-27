"use client";

// path: frontend/src/hooks/useTaskActions.ts

import {
  markTaskDone,
  reopenTask,
  cancelTask,
  cancelTaskRecurrence,
} from "@/services/animalTasks";

export function useTaskActions(
  animalId: string,
  taskId: number,
  onReload: () => Promise<void>
) {
  async function askComment(
    label = "Comentário (opcional):"
  ): Promise<string | null> {
    const v = prompt(label);
    if (v === null) return null;

    const t = v.trim();
    return t || null;
  }

  async function done() {
    const c = await askComment();
    if (c === null) return;

    await markTaskDone(animalId, taskId, c);
    await onReload();
  }

  async function cancel() {
    const ok = confirm("Cancelar esta tarefa?");
    if (!ok) return;

    const c = await askComment();
    if (c === null) return;

    await cancelTask(animalId, taskId, c);
    await onReload();
  }

  async function reopen() {
    const c = await askComment("Motivo da reabertura (opcional):");
    if (c === null) return;

    await reopenTask(animalId, taskId, c);
    await onReload();
  }

  async function cancelRecurrence() {
    const ok = confirm(
      "Cancelar toda a recorrência?\n\n" +
        "As ocorrências futuras que ainda não foram concluídas " +
        "serão canceladas.\n\n" +
        "As ocorrências já concluídas serão mantidas."
    );

    if (!ok) return;

    await cancelTaskRecurrence(
      animalId,
      taskId,
      "Recorrência cancelada pelo utilizador",
      true
    );

    await onReload();
  }

  return {
    done,
    cancel,
    reopen,
    cancelRecurrence,
  };
}
