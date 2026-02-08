// src/services/signup.ts

import { http } from "@/services/http";

type SignupPayload = {
  full_name: string;
  email: string;
  password: string;
};

export async function signup(payload: SignupPayload): Promise<void> {
  await http("/api/public/users/signup", {
    method: "POST",
    body: payload,
  });
}

