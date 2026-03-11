import { http } from "@/services/http";

export type ClinicalProblemStatusDTO = {
  code: string;
  label: string;
  description?: string | null;
};

export type ClinicalProblemPersonDTO = {
  public_id: string | null;
  name: string | null;
};

export type ClinicalProblemSummaryDTO = {
  public_id: string;
  title: string;
  current_diagnosis?: string | null;
  status: ClinicalProblemStatusDTO;
  created_at?: string | null;
  started_at?: string | null;
  closed_at?: string | null;
  created_by?: ClinicalProblemPersonDTO | null;
};

export type ClinicalProblemDetailsDTO = {
  problem: {
    public_id: string;
    title: string;
    current_diagnosis?: string | null;
    status: ClinicalProblemStatusDTO;
    created_at?: string | null;
    started_at?: string | null;
    closed_at?: string | null;
    created_by?: ClinicalProblemPersonDTO | null;
    consultation_origin?: {
      public_id?: string | null;
      date_time?: string | null;
      chief_complaint?: string | null;
    } | null;
  };
};

export type ClinicalProblemEventTypeDTO = {
  code: string;
  label: string;
  description?: string | null;
};

export type ClinicalProblemTimelineEventDTO = {
  public_id: string;
  type: ClinicalProblemEventTypeDTO;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  occurred_at: string;
  created_by?: ClinicalProblemPersonDTO | null;
  consultation_preview?: {
    consultation_public_id?: string | null;
    consultation_date?: string | null;
    consultation_author?: {
      public_id?: string | null;
      name?: string | null;
    } | null;
    chief_complaint?: string | null;
    clinical_exam?: string | null;
    clinical_assessment?: string | null;
  } | null;
};

function normalizeStatus(input: any): ClinicalProblemStatusDTO {
  if (input && typeof input === "object") {
    return {
      code: String(input.code ?? ""),
      label: String(input.label ?? input.code ?? ""),
      description:
        typeof input.description === "string" ? input.description : null,
    };
  }

  return {
    code: String(input ?? ""),
    label: String(input ?? ""),
    description: null,
  };
}

function normalizePerson(input: any): ClinicalProblemPersonDTO | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  return {
    public_id:
      typeof input.public_id === "string"
        ? input.public_id
        : typeof input.person_public_id === "string"
        ? input.person_public_id
        : null,
    name: typeof input.name === "string" ? input.name : null,
  };
}

function normalizeProblemSummary(input: any): ClinicalProblemSummaryDTO {
  return {
    public_id: String(input.public_id ?? ""),
    title: String(input.title ?? input.name ?? ""),
    current_diagnosis:
      typeof input.current_diagnosis === "string"
        ? input.current_diagnosis
        : typeof input.diagnosis === "string"
        ? input.diagnosis
        : null,
    status: normalizeStatus(input.status),
    created_at:
      typeof input.created_at === "string" ? input.created_at : null,
    started_at:
      typeof input.started_at === "string" ? input.started_at : null,
    closed_at:
      typeof input.closed_at === "string" ? input.closed_at : null,
    created_by: normalizePerson(input.created_by),
  };
}

function normalizeProblemDetails(input: any): ClinicalProblemDetailsDTO {
  const raw = input?.problem ?? input ?? {};

  return {
    problem: {
      public_id: String(raw.public_id ?? ""),
      title: String(raw.title ?? raw.name ?? ""),
      current_diagnosis:
        typeof raw.current_diagnosis === "string"
          ? raw.current_diagnosis
          : typeof raw.diagnosis === "string"
          ? raw.diagnosis
          : null,
      status: normalizeStatus(raw.status),
      created_at:
        typeof raw.created_at === "string" ? raw.created_at : null,
      started_at:
        typeof raw.started_at === "string" ? raw.started_at : null,
      closed_at:
        typeof raw.closed_at === "string" ? raw.closed_at : null,
      created_by: normalizePerson(raw.created_by),
      consultation_origin:
        raw.consultation_origin && typeof raw.consultation_origin === "object"
          ? {
              public_id:
                typeof raw.consultation_origin.public_id === "string"
                  ? raw.consultation_origin.public_id
                  : null,
              date_time:
                typeof raw.consultation_origin.date_time === "string"
                  ? raw.consultation_origin.date_time
                  : null,
              chief_complaint:
                typeof raw.consultation_origin.chief_complaint === "string"
                  ? raw.consultation_origin.chief_complaint
                  : null,
            }
          : null,
    },
  };
}

export async function listAnimalClinicalProblems(
  animalPublicId: string
): Promise<ClinicalProblemSummaryDTO[]> {
  const res = await http<{ items?: any[] }>(
    `/api/v1/animals/${animalPublicId}/problems`,
    { method: "GET" }
  );

  return Array.isArray(res?.items)
    ? res.items.map(normalizeProblemSummary)
    : [];
}

export async function createClinicalProblem(
  consultationPublicId: string,
  payload: {
    title: string;
    diagnosis?: string | null;
  }
): Promise<{
  public_id: string;
  title?: string;
  diagnosis?: string | null;
  status?: ClinicalProblemStatusDTO;
  created_at?: string | null;
}> {
  const res = await http<any>(
    `/api/v1/consultations/${consultationPublicId}/problems`,
    {
      method: "POST",
      body: payload,
    }
  );

  return {
    public_id: String(res?.public_id ?? ""),
    title: typeof res?.title === "string" ? res.title : undefined,
    diagnosis:
      typeof res?.diagnosis === "string" ? res.diagnosis : null,
    status: res?.status ? normalizeStatus(res.status) : undefined,
    created_at:
      typeof res?.created_at === "string" ? res.created_at : null,
  };
}

export async function getClinicalProblem(
  problemPublicId: string
): Promise<ClinicalProblemDetailsDTO> {
  const res = await http<any>(`/api/v1/problems/${problemPublicId}`, {
    method: "GET",
  });

  return normalizeProblemDetails(res);
}

export async function getClinicalProblemTimeline(
  problemPublicId: string
): Promise<ClinicalProblemTimelineEventDTO[]> {
  const res = await http<{ items?: any[] }>(
    `/api/v1/problems/${problemPublicId}/timeline`,
    { method: "GET" }
  );

  if (!Array.isArray(res?.items)) {
    return [];
  }

  return res.items.map((item) => ({
    public_id: String(item.public_id ?? ""),
    type: {
      code: String(item?.type?.code ?? ""),
      label: String(item?.type?.label ?? item?.type?.code ?? ""),
      description:
        typeof item?.type?.description === "string"
          ? item.type.description
          : null,
    },
    title: String(item.title ?? ""),
    description:
      typeof item.description === "string" ? item.description : null,
    metadata:
      item.metadata && typeof item.metadata === "object"
        ? item.metadata
        : null,
    occurred_at: String(item.occurred_at ?? ""),
    created_by: normalizePerson(item.created_by),
    consultation_preview:
      item.consultation_preview &&
      typeof item.consultation_preview === "object"
        ? item.consultation_preview
        : null,
  }));
}

export async function updateClinicalProblemDiagnosis(
  problemPublicId: string,
  diagnosis?: string | null
): Promise<{
  public_id: string;
  diagnosis?: string | null;
  status?: ClinicalProblemStatusDTO;
}> {
  const res = await http<any>(
    `/api/v1/problems/${problemPublicId}/diagnosis`,
    {
      method: "PATCH",
      body: { diagnosis: diagnosis ?? null },
    }
  );

  return {
    public_id: String(res?.public_id ?? problemPublicId),
    diagnosis:
      typeof res?.diagnosis === "string" ? res.diagnosis : null,
    status: res?.status ? normalizeStatus(res.status) : undefined,
  };
}

export async function changeClinicalProblemStatus(
  problemPublicId: string,
  statusCode: string
): Promise<{
  public_id: string;
  status?: ClinicalProblemStatusDTO;
  closed_at?: string | null;
}> {
  const res = await http<any>(
    `/api/v1/problems/${problemPublicId}/status`,
    {
      method: "PATCH",
      body: { status_code: statusCode },
    }
  );

  return {
    public_id: String(res?.public_id ?? problemPublicId),
    status: res?.status ? normalizeStatus(res.status) : undefined,
    closed_at:
      typeof res?.closed_at === "string" ? res.closed_at : null,
  };
}

export async function addClinicalProblemNote(
  problemPublicId: string,
  payload: {
    type: string;
    content: string;
  }
): Promise<void> {
  await http(`/api/v1/problems/${problemPublicId}/notes`, {
    method: "POST",
    body: payload,
  });
}

export async function linkClinicalConsultationToProblem(
  problemPublicId: string,
  consultationPublicId: string
): Promise<void> {
  await http(`/api/v1/problems/${problemPublicId}/consultations`, {
    method: "POST",
    body: {
      consultation_public_id: consultationPublicId,
    },
  });
}

export async function listClinicalProblemStatusCodes(): Promise<
  ClinicalProblemStatusDTO[]
> {
  const res = await http<{ items?: any[] }>(
    `/api/v1/catalog/clinical-problem-status`,
    { method: "GET" }
  );

  return Array.isArray(res?.items)
    ? res.items.map(normalizeStatus)
    : [];
}

export async function listClinicalProblemEventTypes(): Promise<
  ClinicalProblemEventTypeDTO[]
> {
  const res = await http<{ items?: any[] }>(
    `/api/v1/catalog/clinical-problem-event-types`,
    { method: "GET" }
  );

  if (!Array.isArray(res?.items)) {
    return [];
  }

  return res.items.map((item) => ({
    code: String(item.code ?? ""),
    label: String(item.label ?? item.code ?? ""),
    description:
      typeof item.description === "string" ? item.description : null,
  }));
}
