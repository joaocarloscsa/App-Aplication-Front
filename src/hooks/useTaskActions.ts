"use client";

import { useModal } from "@/components/ui/modal/ModalProvider";
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
  const { confirm, prompt } = useModal();

  async function askComment(
    label = "Comentário (opcional):"
  ): Promise<string | null> {
    const value = await prompt({
      title: "Comentário",
      label,
    });

    return value;
  }

  async function done() {
    const c = await askComment();
    if (c === null) return;

    await markTaskDone(animalId, taskId, c);
    await onReload();
  }

  async function cancel() {
    const ok = await confirm({
      title: "Cancelar tarefa?",
      message: "Tem certeza que deseja cancelar esta tarefa?",
    });

    if (!ok) return;

    const c = await askComment("Motivo (opcional):");
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
    const ok = await confirm({
      title: "Cancelar recorrência?",
      message:
        "As ocorrências futuras que ainda não foram concluídas serão canceladas.\n\n" +
        "As ocorrências já concluídas serão mantidas.",
    });

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