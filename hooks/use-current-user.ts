"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-users";

type StoredUser = {
  id: number;
  user: string;
  email: string;
  role: string;
  tenantId: number | null;
};

export function useCurrentUser() {
  const [stored, setStored] = useState<StoredUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
      try {
        setStored(JSON.parse(raw));
      } catch {
      }
    }
  }, []);

  const { data: freshUser } = useUser(stored?.id ?? null);

  const effectiveUser = freshUser ?? stored;

  return {
    user: effectiveUser,
    isLoggedIn: !!effectiveUser,
  };
}