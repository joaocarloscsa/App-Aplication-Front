import { useEffect, useState } from "react";
import { fetchVaccineCatalog, VaccineCatalogItem } from "@/services/vaccineCatalog";

export function useVaccineCatalog(animalType?: string) {

  const [vaccines, setVaccines] = useState<VaccineCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!animalType) return;

    setLoading(true);

    fetchVaccineCatalog(animalType)
      .then(setVaccines)
      .finally(() => setLoading(false));

  }, [animalType]);

  return {
    vaccines,
    loading
  };
}
