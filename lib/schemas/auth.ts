import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required").superRefine(
    (val, ctx) => {
      if (val.includes("@")) {
        const emailResult = z.string().email().safeParse(val);
        if (!emailResult.success) {
          ctx.addIssue({ code: "custom", message: "Invalid email format" });
        }
      } else {
        if (val.length < 3) {
          ctx.addIssue({
            code: "custom",
            message: "Username must be at least 3 characters",
          });
        }
      }
    }
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    user: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;