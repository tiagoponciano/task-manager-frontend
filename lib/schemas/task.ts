import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  relevance: z.string().min(1, "Relevance is required"),
  priority: z
    .string()
    .optional()
    .transform((val) =>
      val === undefined || val === "" ? undefined : Number(val),
    )
    .refine((val) => val === undefined || !Number.isNaN(val!), {
      message: "Priority must be a number",
    }),
});

export type CreateTaskFormInput = {
  title: string;
  description?: string;
  dueDate: string;
  relevance: string;
  priority?: number;
};