// path: frontend/src/types/clinicalExamOrders.ts
export type ClinicalExamOrderStatus =
  | "REQUESTED"
  | "COLLECTED"
  | "RECEIVED"
  | "VALIDATED";

export type ClinicalExamOrderPriority = "ROUTINE" | "URGENT";

export type ClinicalExamOrderItem = {
  public_id: string;
  status: ClinicalExamOrderStatus;

  exam_type: string;
  justification: string;

  diagnostic_hypothesis: string | null;
  priority: ClinicalExamOrderPriority;
  laboratory: string | null;

  parameters: string[];

  requested_at: string;
  created_at?: string;

  consultation?: {
    public_id: string | null;
    date_time: string | null;
  };
};

export type ClinicalExamOrderListResponse = {
  items: ClinicalExamOrderItem[];
};
