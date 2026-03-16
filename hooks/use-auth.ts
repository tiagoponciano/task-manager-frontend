"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { identifier: string; password: string }) =>
      apiClient("/user/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    },
  });
}

export function useSignUpMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      user: string;
      email: string;
      password: string;
      tenantId?: number;
    }) =>
      apiClient("/user", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      router.push("/dashboard"); 
    },
  });
}