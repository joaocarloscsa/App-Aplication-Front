'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      full_name: form.full_name.value,
      email: form.email.value,
      password: form.password.value,
      phone: form.phone.value || undefined,
    };

    try {
      await registerUser(data);
      router.push('/check-your-email?email=' + encodeURIComponent(data.email));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="full_name" placeholder="Nome completo" required />
      <input name="email" type="email" placeholder="E-mail" required />
      <input name="password" type="password" placeholder="Senha" required />
      <input name="phone" placeholder="Telefone (opcional)" />

      <button disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
}

