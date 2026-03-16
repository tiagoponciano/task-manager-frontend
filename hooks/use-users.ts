"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { User } from "@/lib/types/user";

const USER_KEYS = {
  all: ["users"] as const,
  detail: (id: number) => ["users", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.all,
    queryFn: () => apiClient<User[]>("/user"),
    staleTime: 60_000,          // data is “fresh” for 1 minute
    refetchOnMount: true,       // let React Query decide based on staleTime
    refetchOnWindowFocus: false, // don't refetch just because tab is focused
    placeholderData: (prev: User[] | undefined) => prev, // keep previous data while refetching
  });
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: USER_KEYS.detail(id!),
    queryFn: () => apiClient<User>(`/user/${id}`),
    enabled: id != null,
  });
}