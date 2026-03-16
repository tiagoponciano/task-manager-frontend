"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/lib/types/task";

const TASK_KEYS = {
  all: ["tasks"] as const,
  detail: (id: number) => ["tasks", id] as const,
};

export function useTasks() {
  return useQuery({
    queryKey: TASK_KEYS.all,
    queryFn: () => apiClient<Task[]>(`/task`),
  });
}

export function useTask(id: number | null) {
  return useQuery({
    queryKey: TASK_KEYS.detail(id!),
    queryFn: () => apiClient<Task>(`/task/${id}`),
    enabled: id != null,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) =>
      apiClient("/task", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & UpdateTaskInput) =>
      apiClient(`/task/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient(`/task/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}