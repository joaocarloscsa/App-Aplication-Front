export type ClinicalExamOrderStatus =
  | "REQUESTED"
  | "COLLECTED"
  | "RECEIVED"
  | "VALIDATED";

export type ClinicalExamOrderPriority = "ROUTINE" | "URGENT";

/* =========================
EXAM TYPES (CATÁLOGO)
========================= */

export type ClinicalExamTypeItem = {
  public_id: string;
  code: string;
  name: string;

  category: {
    code: string;
    name: string;
  };
};

export type ClinicalExamTypeListResponse = {
  items: ClinicalExamTypeItem[];
};

/* =========================
EXAM ORDERS
========================= */

export type ClinicalExamOrderItem = {
  public_id: string;
  status: ClinicalExamOrderStatus;

  exam_type: {
  public_id: string
  code: string
  name: string
}
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
