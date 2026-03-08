export type ClinicalExamOrderStatus =
  | "REQUESTED"
  | "PARTIAL"
  | "COMPLETED";

export type ClinicalExamRequestStatus =
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
EXAM RESULTS
========================= */

export type ClinicalExamResultItem = {
  public_id: string;
  file_name: string;
  uploaded_at: string;
  clinical_interpretation?: string | null;
  read_url?: string | null;
};

/* =========================
EXAM REQUESTS
========================= */

export type ClinicalExamRequestItem = {
  public_id: string;
  status: ClinicalExamRequestStatus;

  exam_type: {
    public_id: string;
    code: string;
    name: string;
  };

  laboratory?: string | null;
  parameters?: string[];
  created_at?: string;
  results?: ClinicalExamResultItem[];
};

/* =========================
EXAM ORDERS
========================= */

export type ClinicalExamOrderItem = {
  public_id: string;
  status: ClinicalExamOrderStatus;
  priority: ClinicalExamOrderPriority;
  laboratory?: string | null;
  parameters?: string[];

  justification: string;
  diagnostic_hypothesis: string | null;

  requested_at: string;
  created_at?: string;

  consultation?: {
    public_id: string | null;
    date_time: string | null;
  };

  requests?: ClinicalExamRequestItem[];
};

export type ClinicalExamOrderListResponse = {
  items: ClinicalExamOrderItem[];
};