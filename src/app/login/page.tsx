// /var/www/GSA/animal/frontend/src/app/login/page.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { useMe } from "@/components/MeContext";

export default function LoginPage() {
  const router = useRouter();
  const { me, reloadMe, loading } = useMe();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && me !== null) {
      router.replace("/dashboard");
    }
  }, [loading, me, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      await reloadMe();
    } catch {
      setError("E-mail ou senha inválidos");
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    const frontendBase = window.location.origin;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    window.location.href =
      `${apiBase}/connect/google?redirect_uri=` +
      encodeURIComponent(frontendBase);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-50">
                <span className="text-sm font-semibold tracking-tight">
                  GSA
                </span>
              </div>
              <div>
                <div className="text-lg font-semibold leading-6">
                  GSA Animal
                </div>
                <div className="text-sm text-zinc-600">
                  Entre para continuar
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-900"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-zinc-50 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white text-sm font-semibold hover:bg-zinc-50"
              >
                <img src="/google.svg" className="h-4 w-4" />
                Entrar com Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

