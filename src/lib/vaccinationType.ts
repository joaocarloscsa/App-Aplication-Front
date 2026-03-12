// path: frontend/src/lib/vaccinationType.ts

export type VaccinationType = "initial" | "booster" | "annual";

export const VaccinationTypeLabels: Record<VaccinationType, string> = {
  initial: "Série inicial",
  booster: "Reforço",
  annual: "Revacinação anual",
};

export function vaccinationTypeLabel(type?: string | null): string {
  if (!type) return "Vacinação";

  const key = type as VaccinationType;

  return VaccinationTypeLabels[key] ?? type;
}

export function vaccinationRequiresDose(type?: string | null): boolean {
  return type === "initial";
}

export function vaccinationDisplayTitle(
  vaccineName: string,
  type?: string | null,
  doseNumber?: number | null
): string {

  if (type === "initial" && doseNumber) {
    return `${vaccineName} — Dose ${doseNumber}`;
  }

  if (type === "booster") {
    return `${vaccineName} — Reforço`;
  }

  if (type === "annual") {
    return `${vaccineName} — Revacinação anual`;
  }

  return vaccineName;
}
