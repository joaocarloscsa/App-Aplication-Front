import { http } from "./http";

export type PrescriptionRuleDTO = {
  requires_dose_amount: boolean;
  requires_dose_unit: boolean;
  allows_strength: boolean;
  requires_strength: boolean;
  is_procedure: boolean;
};

export type DosageUnitDTO = {
  public_id: string;
  code: string;
  label: string;
};

export type AdministrationRouteDTO = {
  public_id: string;
  code: string;
  label: string;
  rule: PrescriptionRuleDTO;
  allowed_units: DosageUnitDTO[];
};

type RoutesResponse = {
  routes: AdministrationRouteDTO[];
};

type UnitsResponse = {
  units: DosageUnitDTO[];
};

export async function fetchAdministrationRoutes(): Promise<AdministrationRouteDTO[]> {
  const res = await http("/api/v1/treatment-config/routes") as RoutesResponse;
  return res.routes;
}

export async function fetchDosageUnits(): Promise<DosageUnitDTO[]> {
  const res = await http("/api/v1/treatment-config/units") as UnitsResponse;
  return res.units;
}

