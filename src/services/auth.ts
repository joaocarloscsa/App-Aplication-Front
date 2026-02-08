// src/services/auth.ts

import { http } from "@/services/http";
import { setAccessToken, clearAccessToken } from "@/stores/auth";
import { HttpError } from "@/services/http";

/* =========================
   TYPES
========================= */

type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

type OAuthExchangeResponse = {
  token: string;
};

type ApiError = {
  code: string;
  message: string;
};

/* =========================
   LOGIN
========================= */

export async function login(email: string, password: string): Promise<void> {
  try {
    const response = await http<LoginResponse>(
      "/api/login",
      {
        method: "POST",
        body: { email, password },
        credentials: "include",
      },
      false
    );
     setAccessToken(response.access_token);
    // só chega aqui se autenticou
    return;
  } catch (err) {
    if (err instanceof HttpError && err.body) {
      throw err.body; // 🔥 REPASSA o JSON real do backend
    }
    throw err;
  }
}



export async function oauthExchange(
  provider: "google",
  exchangeCode: string
): Promise<void> {
  const response = await http<OAuthExchangeResponse>(
    "/api/auth/oauth/exchange",
    {
      method: "POST",
      body: {
        provider,
        exchange_code: exchangeCode,
      },
      credentials: "include",
    }
  );

  setAccessToken(response.token);
}

export function logout(): void {
  clearAccessToken();
}

/* =========================
   REGISTRO
========================= */

export async function registerUser(data: {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<void> {
  await http("/api/public/users/signup", {
    method: "POST",
    body: data,
  });
}

/* =========================
   VERIFICAÇÃO DE E-MAIL
========================= */

export async function verifyEmail(token: string): Promise<void> {
  try {
    await http(`/api/public/users/verify-email/${token}`, {
      method: "POST",
    });
  } catch (err: any) {
    if (err instanceof Error && 'body' in err) {
      const body = err.body as any;

      if (body?.error?.code) {
        throw body.error;
      }
    }

    throw {
      code: "email_verification_unknown_error",
      message: "Erro inesperado ao verificar e-mail.",
    };
  }
}

