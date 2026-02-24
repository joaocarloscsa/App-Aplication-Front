export type ChangeTreatmentStatusPayload = {
  action: "paused" | "resumed" | "finished";
  notes: string;
};

import { http } from "@/services/http";

export type TreatmentStatusEventResponse = {
  event: {
    public_id: string;
    action: string;
    notes: string;
    performed_by: string;
    performed_at: string;
  };
  treatment: {
    public_id: string;
    status: string;
  };
};

export async function changeTreatmentStatus(
  treatmentPublicId: string,
  payload: ChangeTreatmentStatusPayload
): Promise<TreatmentStatusEventResponse> {
  return http<TreatmentStatusEventResponse>(
    `/api/v1/treatments/${treatmentPublicId}/status`,
    {
      method: "POST",
      body: payload,
    }
  );
}
