import { Suspense } from "react";

function Content({ email }: { email: string | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white text-xl">
          📬
        </div>

        <h1 className="mb-2 text-lg font-semibold text-zinc-900">
          Verifique seu e-mail
        </h1>

        <p className="mb-4 text-sm text-zinc-600">
          Se este e-mail puder receber mensagens, enviamos um link de confirmação.
        </p>

        {email && (
          <p className="mb-4 text-sm text-zinc-800">
            Endereço informado: <br />
            <strong>{email}</strong>
          </p>
        )}

        <p className="mb-6 text-xs text-zinc-500">
          Confira também a pasta de spam.  
          Se você já possui uma conta, pode usar a opção
          <strong> “Esqueci a senha”</strong>.
        </p>

        <a
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Voltar para o login
        </a>
      </div>
    </div>
  );
}

export default function CheckYourEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <Suspense>
      <Content email={searchParams.email ?? null} />
    </Suspense>
  );
}

