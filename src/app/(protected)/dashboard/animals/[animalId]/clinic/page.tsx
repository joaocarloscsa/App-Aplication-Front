// src/app/(protected)/dashboard/animals/[animalId]/clinic/page.tsx

export default function AnimalClinicOverviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-zinc-900">
        Clínica do animal
      </h1>

      <p className="text-sm text-zinc-600">
        Histórico clínico, tratamentos, medicações e cuidados médicos
        do animal, organizados de forma cronológica.
      </p>

      <p className="text-sm text-zinc-500">
        Use o menu acima para navegar entre as seções clínicas.
      </p>
    </div>
  );
}
