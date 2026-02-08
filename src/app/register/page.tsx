// src/app/register/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/services/signup";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("Informe nome e sobrenome");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      await signup({
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/check-your-email");
    } catch {
      setError("Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white">
            GSA
          </div>
          <h1 className="text-xl font-semibold">Criar conta</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Cadastro rápido para começar a usar a plataforma
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Primeiro nome"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />

              <input
                placeholder="Sobrenome"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />

            <input
              type="password"
              placeholder="Senha (mínimo 8 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-zinc-600">
          Já tem conta?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-medium text-zinc-900 hover:underline"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
