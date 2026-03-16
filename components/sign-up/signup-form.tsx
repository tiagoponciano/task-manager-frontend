"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpSchema, type SignUpInput } from "@/lib/schemas/auth";
import { useSignUpMutation } from "@/hooks/use-auth";
import { z } from "zod";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpInput, string>>
  >({});
  const signUpMutation = useSignUpMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = {
      user: formData.get("user") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const result = signUpSchema.safeParse(raw);

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      const errors: Partial<Record<keyof SignUpInput, string>> = {};
      for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
        if (messages?.[0]) {
          errors[key as keyof SignUpInput] = messages[0];
        }
      }
      setFieldErrors(errors);
      return;
    }

    const { confirmPassword: _, ...payload } = result.data;
    signUpMutation.mutate(payload);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="user">Username</FieldLabel>
              <Input
                id="user"
                name="user"
                type="text"
                placeholder="john_doe"
                autoComplete="username"
                aria-invalid={!!fieldErrors.user}
              />
              {fieldErrors.user && (
                <p className="text-sm text-destructive">{fieldErrors.user}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.password}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.confirmPassword}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
              )}
            </Field>
            <FieldGroup>
              <Field>
                {signUpMutation.error && (
                  <p className="text-sm text-destructive">{signUpMutation.error.message}</p>
                )}
                <Button type="submit" disabled={signUpMutation.isPending}>
                  {signUpMutation.isPending ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}