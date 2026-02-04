// /var/www/GSA/animal/frontend/src/app/auth/callback/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { oauthExchange } from "@/services/auth";
import { useMe } from "@/components/MeContext";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reloadMe } = useMe();

  useEffect(() => {
    async function handleCallback() {
      const exchangeCode = searchParams.get("exchange_code");

      if (!exchangeCode) {
        router.replace("/login");
        return;
      }

      try {
        await oauthExchange("google", exchangeCode);
        await reloadMe();
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    }

    handleCallback();
  }, [searchParams, reloadMe, router]);

  return null;
}

