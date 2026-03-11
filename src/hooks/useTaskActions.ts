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

async function execute(
  action: () => Promise<unknown>
){
    await action();
    await onReload();
  }

  async function done() {
    const comment = await askComment();
    if (comment === null) return;

    await execute(() =>
      markTaskDone(animalId, taskId, comment)
    );
  }

  async function cancel() {
    const ok = await confirm({
      title: "Cancelar tarefa?",
      message: "Tem certeza que deseja cancelar esta tarefa?",
    });

    if (!ok) return;

    const comment = await askComment("Motivo (opcional):");
    if (comment === null) return;

    await execute(() =>
      cancelTask(animalId, taskId, comment)
    );
  }

  async function reopen() {
    const comment = await askComment(
      "Motivo da reabertura (opcional):"
    );
    if (comment === null) return;

    await execute(() =>
      reopenTask(animalId, taskId, comment)
    );
  }

  async function cancelRecurrence() {
    const ok = await confirm({
      title: "Cancelar recorrência?",
      message:
        "As ocorrências futuras que ainda não foram concluídas serão canceladas.\n\n" +
        "As ocorrências já concluídas serão mantidas.",
    });

    if (!ok) return;

    await execute(() =>
      cancelTaskRecurrence(
        animalId,
        taskId,
        "Recorrência cancelada pelo utilizador",
        true
      )
    );
  }

  return {
    done,
    cancel,
    reopen,
    cancelRecurrence,
  };
}