
"use client";

import * as React from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DataTable } from "@/components/dashboard/data-table";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTasks } from "@/hooks/use-tasks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();
  const [statusFilter, setStatusFilter] = React.useState<"all" | "open" | "done">("all");

  const filteredTasks =
    tasks?.filter((t) => {
      if (statusFilter === "open") return !t.concluded;
      if (statusFilter === "done") return !!t.concluded;
      return true;
    }) ?? [];

  const tableData =
    filteredTasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description ?? null,
      dueTo: t.dueTo,
      relevance: t.relevance,
      priority: t.priority ?? 0,
      concluded: t.concluded ?? false,
      createdOn: t.createdOn,
      userId: t.userId,
    })) ?? [];

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Failed to load tasks</div>;
  }

  return (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as "all" | "open" | "done")
                }
              >
                <SelectTrigger id="status-filter" className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="done">Concluded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DataTable data={tableData} />
          </div>
        </div>
  );
}