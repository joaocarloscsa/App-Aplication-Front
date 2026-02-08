// /var/www/GSA/animal/frontend/src/app/forgot-password/page.tsx

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setSubmitting(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/password/reset/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Sempre sucesso visual (anti-enumeração)
      setDone(true);
    } catch {
      // Mesmo em erro, UX neutra
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* HEADER */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-50 text-sm font-semibold">
              GSA
            </div>
            <div>
              <div className="text-lg font-semibold leading-6">
                Recuperar senha
              </div>
              <div className="text-sm text-zinc-600">
                Enviaremos instruções por e-mail
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {!done ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Enviar instruções"}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm text-zinc-700">
                <p>
                  Se existir uma conta associada a este e-mail, enviaremos
                  instruções para redefinir a senha.
                </p>
                <p className="text-zinc-500">
                  Verifique também a caixa de spam.
                </p>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-zinc-600 hover:underline"
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

