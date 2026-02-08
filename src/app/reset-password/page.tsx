// /var/www/GSA/animal/frontend/src/app/reset-password/page.tsx

"use client";

import { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,12}$/;
const PASSWORD_RULE_TEXT =
  "A senha deve ter entre 5 e 12 caracteres e conter letras maiúsculas, letras minúsculas e números. Caracteres especiais são opcionais.";


type ApiError = {
  error?: {
    code?: string;
    message?: string;
  };
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,12}$/;
  const PASSWORD_MESSAGE = "A senha deve ter entre 5 e 12 caracteres e conter letras maiúsculas, letras minúsculas e números. Caracteres especiais são opcionais.";


  if (!token) {
    return (
      <CenteredCard
        title="Link inválido"
        message="O link de redefinição de senha é inválido. Solicite um novo link."
      />
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
    setError(PASSWORD_MESSAGE);
    return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/password/reset/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token,
            new_password: password,
          }),
        }
      );

      const data = (await res.json()) as ApiError;

      if (!res.ok) {
        throw data;
      }

      setSuccess(true);

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (err: any) {
      const code = err?.error?.code;

      switch (code) {
        case "password_reset_invalid_token":
          setError("O link de redefinição é inválido.");
          break;
        case "password_reset_token_expired":
          setError("Este link expirou. Solicite um novo.");
          break;
        case "password_reset_token_already_used":
          setError("Este link já foi utilizado.");
          break;
        case "password_reset_invalid_password":
          setError("A senha não atende aos requisitos mínimos.");
          break;
        default:
          setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-lg font-semibold text-zinc-900">
          Redefinir senha
        </h1>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Nova senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
                <p className="text-xs text-zinc-500">
                {PASSWORD_RULE_TEXT}
                </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {submitting ? "Salvando..." : "Alterar senha"}
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-sm text-zinc-700">
            <p>Sua senha foi alterada com sucesso.</p>
            <p className="text-zinc-500">
              Você será redirecionado para o login.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   COMPONENTE AUXILIAR
========================= */

function CenteredCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <h1 className="mb-2 text-lg font-semibold text-zinc-900">
          {title}
        </h1>
        <p className="text-sm text-zinc-600">{message}</p>
      </div>
    </div>
  );
}
