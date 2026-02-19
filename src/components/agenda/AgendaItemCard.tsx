// path: frontend/src/components/agenda/AgendaItemCard.tsx

"use client";

import type { AnimalTaskItem } from "@/types/agenda";
import { TaskCard } from "./TaskCard";

type Props = {
  animalId: string;
  item: AnimalTaskItem;
  onAction(
    taskId: number,
    action: "done" | "reopen" | "cancel",
    comment: string | null
  ): Promise<void>;
  onRefresh?: () => void;
};

export function AgendaItemCard({
  animalId,
  item,
  onAction,
  onRefresh,
}: Props) {
  return (
    <TaskCard
      animalId={animalId}
      task={item}
      onAction={async (action, comment) => {
        await onAction(item.id, action, comment);
        onRefresh?.();
      }}
      onRefresh={onRefresh}
    />
  );
}
