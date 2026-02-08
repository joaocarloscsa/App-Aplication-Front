"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { http } from "@/services/http";

export default function EmailNotVerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [loading, setLoading] = useState(false);

  async function handleResend() {
    if (!email || loading) return;

    setLoading(true);

    try {
      await http("/api/public/users/resend-verification", {
        method: "POST",
        body: { email },
      });
    } catch {
      // resposta neutra — ignorada propositalmente
    } finally {
      router.replace(
        `/check-your-email?email=${encodeURIComponent(email)}`
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center">
        <div className="mb-4 text-3xl">📧</div>

        <h1 className="text-lg font-semibold text-zinc-900">
          E-mail não verificado
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          Seu cadastro foi encontrado, mas o e-mail ainda não foi confirmado.
        </p>

        <p className="mt-2 text-sm text-zinc-600">
          Enviaremos um novo link para:
          <br />
          <strong className="text-zinc-900">{email}</strong>
        </p>

        <button
          onClick={handleResend}
          disabled={loading}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Reenviar e-mail de verificação"}
        </button>
      </div>
    </div>
  );
}
