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
    } catch (err: any) {
      if (err?.message === "email_not_verified") {
        router.push(`/email-not-verified?email=${encodeURIComponent(email)}`);
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
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-50 text-sm font-semibold">
              GSA
            </div>
            <div>
              <div className="text-lg font-semibold leading-6">
                GSA Animal
              </div>
              <div className="text-sm text-zinc-600">
                Acesso à plataforma
              </div>
            </div>
          </div>

        <div className="rounded-2xl border bg-white p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-xl border px-3 text-sm"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 w-full rounded-xl border px-3 text-sm"
            />

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

<button
  type="submit"
  disabled={submitting}
  className={`
    h-11 w-full rounded-xl
    bg-zinc-900 text-white font-medium
    transition
    ${submitting
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer hover:bg-zinc-800"}
  `}
>
  {submitting ? "Entrando..." : "Entrar"}
</button>

          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-zinc-500">
                ou
              </span>
            </div>
          </div>

<button
  type="button"
  onClick={handleGoogleLogin}
  className="
    h-11 w-full rounded-xl border border-zinc-300
    flex items-center justify-center gap-3
    bg-white text-sm font-medium text-zinc-800
    hover:bg-zinc-50 hover:border-zinc-400
    focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2
    transition
  "
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.7 1.23 9.2 3.25l6.9-6.9C35.9 2.35 30.3 0 24 0 14.6 0 6.4 5.38 2.5 13.2l8 6.2C12.3 13.1 17.7 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.1 24.5c0-1.6-.15-3.15-.43-4.65H24v9h12.4c-.54 2.9-2.18 5.35-4.64 7.05l7.1 5.5c4.15-3.85 6.24-9.5 6.24-16.95z"
    />
    <path
      fill="#FBBC05"
      d="M10.5 28.4c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9l-8-6.2C.9 15.8 0 19.8 0 23.5s.9 7.7 2.5 11.1l8-6.2z"
    />
    <path
      fill="#34A853"
      d="M24 47c6.3 0 11.9-2.1 15.9-5.7l-7.1-5.5c-2 1.35-4.55 2.15-8.8 2.15-6.3 0-11.7-3.6-13.5-8.9l-8 6.2C6.4 42.6 14.6 47 24 47z"
    />
  </svg>

  <span>Entrar com Google</span>
</button>



        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">

<button
  type="button"
  onClick={() => router.push("/forgot-password")}
  className="
    h-14 w-full rounded-xl border border-zinc-300
    bg-white text-left px-4
    hover:bg-zinc-50 hover:border-zinc-400
    focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2
    transition
  "
>
  <div className="text-sm font-medium text-zinc-900">
    Esqueci a senha
  </div>
  <div className="text-xs text-zinc-500">
    Recuperar acesso
  </div>
</button>

<button
  type="button"
  onClick={() => router.push("/register")}
  className="
    h-14 w-full rounded-xl border border-zinc-300
    bg-white text-left px-4
    hover:bg-zinc-50 hover:border-zinc-400
    focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2
    transition
  "
>
  <div className="text-sm font-medium text-zinc-900">
    Criar conta
  </div>
  <div className="text-xs text-zinc-500">
    Novo registro
  </div>
</button>


  
</div>

      </div>
    </div>
  );
}

