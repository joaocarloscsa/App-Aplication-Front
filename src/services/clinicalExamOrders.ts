// frontend/src/services/clinicalExamOrders.ts

import { apiFetch } from "./api";

import type {
  ClinicalExamOrderListResponse,
  ClinicalExamOrderPriority,
  ClinicalExamTypeListResponse,
} from "@/types/clinicalExamOrders";

export async function listConsultationExamOrders(
  consultationPublicId: string
): Promise<ClinicalExamOrderListResponse> {
  return apiFetch(
    `/api/v1/consultations/${consultationPublicId}/exam-orders`
  ) as Promise<ClinicalExamOrderListResponse>;
}

export async function createClinicalExamOrder(
  consultationPublicId: string,
  payload: {
    exam_types: string[];
    justification: string;
    diagnostic_hypothesis?: string | null;
    notes?: string | null;
    priority?: ClinicalExamOrderPriority;
    laboratory?: string | null;
    parameters?: string[];
    problem_ids?: string[];
  }
): Promise<{ public_id: string; status: string }> {
  return apiFetch(
    `/api/v1/consultations/${consultationPublicId}/exam-orders`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  ) as Promise<{ public_id: string; status: string }>;
}

export async function listAnimalExamOrders(
  animalPublicId: string
): Promise<ClinicalExamOrderListResponse> {
  return apiFetch(
    `/api/v1/animals/${animalPublicId}/exam-orders`
  ) as Promise<ClinicalExamOrderListResponse>;
}

export async function uploadClinicalExamResult(
  requestPublicId: string,
  file: File,
  clinicalInterpretation?: string
) {
  const formData = new FormData();

  formData.append("file", file);

  if (clinicalInterpretation) {
    formData.append("clinical_interpretation", clinicalInterpretation);
  }

  return apiFetch(`/api/v1/exam-requests/${requestPublicId}/results`, {
    method: "POST",
    body: formData,
  });
}

export async function validateClinicalExamResult(
  examResultPublicId: string
) {
  return apiFetch(`/api/v1/exam-results/${examResultPublicId}/validate`, {
    method: "POST",
  });
}

export async function listClinicalExamTypes(): Promise<ClinicalExamTypeListResponse> {
  return apiFetch(
    "/api/v1/exam-types"
  ) as Promise<ClinicalExamTypeListResponse>;
}

export async function deleteClinicalExamResult(
  publicId: string
): Promise<{
  status: string;
  exam_request_status: string;
  exam_order_status: string;
}> {
  return apiFetch(`/api/v1/exam-results/${publicId}`, {
    method: "DELETE",
  }) as Promise<{
    status: string;
    exam_request_status: string;
    exam_order_status: string;
  }>;
}