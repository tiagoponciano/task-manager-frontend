"use client";

import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import { TopTasksToDo } from "@/components/dashboard/top-tasks-to-do";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/lib/types/task";

export default function Page() {
  const { data: tasks, isLoading, isError } = useTasks();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {isLoading ? (
        <div className="px-4 lg:px-6 text-muted-foreground">Loading…</div>
      ) : isError ? (
        <div className="px-4 lg:px-6 text-destructive">Failed to load tasks.</div>
      ) : null}

      {tasks && (tasks as Task[]).length > 0 && (
        <>
          <SectionCards tasks={tasks as Task[]} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive tasks={tasks as Task[]} />
          </div>
          <div className="px-4 lg:px-6">
            <TopTasksToDo tasks={tasks as Task[]} />
          </div>
        </>
      )}
    </div>
  );
}