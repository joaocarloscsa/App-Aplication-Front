import { http } from "@/services/http";

export type ScheduleStatusAction =
  | "pause"
  | "resume"
  | "finish"
  | "cancel";

export function changeTreatmentScheduleStatus(
  schedulePublicId: string,
  payload: {
    action: ScheduleStatusAction;
    notes: string;
  }
) {
  return http(
    `/api/v1/treatment-schedules/${schedulePublicId}/status`,
    {
      method: "POST",
      body: payload,
    }
  );
}
