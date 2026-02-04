// /var/www/GSA/animal/frontend/src/services/auth.ts

import { http } from "@/services/http";
import { setAccessToken, clearAccessToken } from "@/stores/auth";

type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

type OAuthExchangeResponse = {
  access_token: string;
};

export async function login(email: string, password: string): Promise<void> {
  const response = await http<LoginResponse>("/api/login", {
    method: "POST",
    body: {
      email,
      password,
    },
    credentials: "include", // OBRIGATÓRIO
  });

  setAccessToken(response.access_token);
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

  setAccessToken(response.access_token);
}

export async function logout(): Promise<void> {
  try {
    await http("/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAccessToken();
  }
}

