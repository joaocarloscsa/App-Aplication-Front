// /var/www/GSA/animal/frontend/src/app/register/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
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

  // ✅ Email simples e suficiente (evita false negatives)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ 5–12 chars, pelo menos 1 minúscula, 1 maiúscula, 1 número
  // caracteres especiais são permitidos (não obrigatórios)
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,12}$/;

  const PASSWORD_MESSAGE =
    "A senha deve ter entre 5 e 12 caracteres e conter letras maiúsculas, letras minúsculas e números. Caracteres especiais são opcionais.";

  const fullName = useMemo(() => {
    const fn = firstName.trim().replace(/\s+/g, " ");
    const ln = lastName.trim().replace(/\s+/g, " ");
    return `${fn} ${ln}`.trim();
  }, [firstName, lastName]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const fn = firstName.trim();
    const ln = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (fn.length < 2 || ln.length < 2) {
      setError("Informe nome e sobrenome.");
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError(PASSWORD_MESSAGE);
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await signup({
        full_name: fullName,
        email: normalizedEmail,
        password,
      });

      router.replace(`/check-your-email?email=${encodeURIComponent(normalizedEmail)}`);
    } catch {
      setError("Não foi possível criar a conta. Tente novamente.");
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
          <h1 className="text-xl font-semibold text-zinc-900">Criar conta</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Cadastro rápido para começar a usar a plataforma
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-800">
                  Primeiro nome
                </label>
                <input
                  placeholder="Ex.: João"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-800">
                  Sobrenome
                </label>
                <input
                  placeholder="Ex.: Carlos"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-800">E-mail</label>
              <input
                type="email"
                placeholder="email@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-800">Senha</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </div>

              <p className="text-xs text-zinc-500">{PASSWORD_MESSAGE}</p>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-800">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  placeholder="Repita a senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
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
