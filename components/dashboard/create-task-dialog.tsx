"use client";

import { useState } from "react";
import { createTaskSchema, type CreateTaskFormInput } from "@/lib/schemas/task";
import { useCreateTaskMutation } from "@/hooks/use-tasks";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

export function CreateTaskDialog() {
  const { user } = useCurrentUser();
  const createTaskMutation = useCreateTaskMutation();

  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateTaskFormInput, string>>
  >({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  // We only track the due date; time is no longer used.

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    if (!user) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = createTaskSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      relevance: formData.get("relevance"),
      priority: formData.get("priority"),
    });

    if (!result.success) {
      const errors: Partial<Record<keyof CreateTaskFormInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CreateTaskFormInput;
        if (path && !errors[path]) {
          errors[path] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    const parsed = result.data;

    // We only have a date string (YYYY-MM-DD). Use midnight as the time.
    const combined = `${parsed.dueDate}T00:00:00`;
    const dueToIso = new Date(combined).toISOString();
    const payload = {
      title: parsed.title,
      description: parsed.description,
      dueTo: dueToIso,
      relevance: parsed.relevance,
      priority: parsed.priority === undefined ? undefined : parsed.priority,
      userId: user.id,
    };

    createTaskMutation.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <span className="hidden lg:inline">Add task</span>
          <span className="lg:hidden">+</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create task</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                aria-invalid={!!fieldErrors.title}
              />
              {fieldErrors.title && (
                <p className="text-sm text-destructive">{fieldErrors.title}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input id="description" name="description" />
            </Field>
            <Field>
              <FieldLabel htmlFor="dueDate">Due date</FieldLabel>
              <div className="relative">
                <Input
                  id="dueDateDisplay"
                  readOnly
                  onClick={() => setShowCalendar((prev) => !prev)}
                  value={
                    selectedDate
                      ? selectedDate.toLocaleDateString()
                      : ""
                  }
                  placeholder="Select a date"
                  aria-invalid={!!fieldErrors.dueDate}
                />
                {showCalendar && (
                  <div className="absolute z-50 mt-2 rounded-lg border bg-background p-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (!date) return;
                        setSelectedDate(date);
                        const hidden = document.getElementById(
                          "dueDate",
                        ) as HTMLInputElement | null;
                        if (hidden) {
                          hidden.value = date
                            .toISOString()
                            .slice(0, 10);
                        }
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <input
                id="dueDate"
                name="dueDate"
                type="hidden"
                aria-invalid={!!fieldErrors.dueDate}
              />
              {fieldErrors.dueDate && (
                <p className="text-sm text-destructive">
                  {fieldErrors.dueDate}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="relevance">Relevance</FieldLabel>
              <Select
                name="relevance"
                onValueChange={(value) => {
                  // we write into a hidden input so FormData can see it
                  const hidden = document.getElementById(
                    "relevance",
                  ) as HTMLInputElement | null;
                  if (hidden) hidden.value = value;
                }}
              >
                <SelectTrigger
                  id="relevance-select"
                  aria-invalid={!!fieldErrors.relevance}
                  className="w-full"
                >
                  <SelectValue placeholder="Select relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* hidden input that actually carries the value into FormData */}
              <input id="relevance" name="relevance" type="hidden" />
              {fieldErrors.relevance && (
                <p className="text-sm text-destructive">
                  {fieldErrors.relevance}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="priority">Priority</FieldLabel>
              <Select
                name="priority"
                onValueChange={(value) => {
                  const hidden = document.getElementById(
                    "priority",
                  ) as HTMLInputElement | null;
                  if (hidden) hidden.value = value;
                }}
              >
                <SelectTrigger
                  id="priority-select"
                  aria-invalid={!!fieldErrors.priority}
                  className="w-full"
                >
                  <SelectValue placeholder="Select priority (1–5)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input id="priority" name="priority" type="hidden" />
              <FieldDescription>
                Optional. 1 = lowest, 5 = highest.
              </FieldDescription>
              {fieldErrors.priority && (
                <p className="text-sm text-destructive">
                  {fieldErrors.priority}
                </p>
              )}
            </Field>
          </FieldGroup>

          {createTaskMutation.error && (
            <p className="text-sm text-destructive">
              {createTaskMutation.error.message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? "Creating..." : "Create task"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
