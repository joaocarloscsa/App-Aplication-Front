import { apiFetch } from "./api";
import type {
  ClinicalExamOrderListResponse,
  ClinicalExamOrderPriority,
} from "@/types/clinicalExamOrders";

export async function listConsultationExamOrders(
  consultationPublicId: string
): Promise<ClinicalExamOrderListResponse> {
  return apiFetch(`/api/v1/consultations/${consultationPublicId}/exam-orders`);
}

export async function createClinicalExamOrder(
  consultationPublicId: string,
  payload: {
    exam_type: string;
    justification: string;
    diagnostic_hypothesis?: string | null;
    priority?: ClinicalExamOrderPriority;
    laboratory?: string | null;
    parameters?: string[];
    problem_ids?: string[];
  }
): Promise<{ public_id: string; status: string }> {
  return apiFetch(`/api/v1/consultations/${consultationPublicId}/exam-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function listAnimalExamOrders(
  animalPublicId: string
): Promise<ClinicalExamOrderListResponse> {
  return apiFetch(`/api/v1/animals/${animalPublicId}/exam-orders`);
}