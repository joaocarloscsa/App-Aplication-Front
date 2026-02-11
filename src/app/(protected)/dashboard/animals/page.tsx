import AnimalsList from "./animals-list";

export default function AnimalsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold text-zinc-900">
        Animais
      </h1>

      <p className="text-sm text-zinc-600">
        Lista de animais disponíveis no momento.
      </p>

      <AnimalsList />
    </section>
  );
}
