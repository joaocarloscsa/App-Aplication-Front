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
  const PASSWORD_HINT ="A senha deve ter entre 5 e 12 caracteres e conter letras maiúsculas, letras minúsculas e números.";


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
} catch (err: any) {
  const apiMessage = err?.message;

  if (apiMessage === "email_not_verified") {
    router.push(
      `/email-not-verified?email=${encodeURIComponent(email)}`
    );
    return;
  }
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
        <div className="w-full max-w-md space-y-6">

          {/* HEADER */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-50 text-sm font-semibold">
              GSA
            </div>
            <div>
              <div className="text-lg font-semibold">GSA Animal</div>
              <div className="text-sm text-zinc-600">Acesso à plataforma</div>
            </div>
          </div>

          {/* LOGIN CARD */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                />
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 space-y-1">
                      <div>{error}</div>
                      <div className="text-xs text-zinc-600">
                        {PASSWORD_HINT}
                      </div>
                    </div>
                  )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-xl bg-zinc-900 text-white"
              >
                {submitting ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>

          {/* AUX */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="rounded-xl border p-4 text-left text-sm"
            >
              Esqueci a senha
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="rounded-xl border p-4 text-left text-sm"
            >
              Criar conta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
