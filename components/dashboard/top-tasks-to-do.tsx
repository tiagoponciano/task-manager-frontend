"use client"

import Link from "next/link"
import type { Task } from "@/lib/types/task"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListChecksIcon, ArrowRightIcon } from "lucide-react"

export function TopTasksToDo({
  tasks,
  limit = 5,
}: {
  tasks: Task[]
  limit?: number
}) {
  const topTasks = [...tasks]
    .filter((t) => !t.concluded)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .slice(0, limit)

  if (topTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecksIcon className="size-5" />
            Top Tasks to Do
          </CardTitle>
          <CardDescription>No pending tasks. Great job!</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecksIcon className="size-5" />
            Top Tasks to Do
          </CardTitle>
          <Link
            href="/dashboard/tasks"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <CardDescription>Highest priority tasks first</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {topTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{task.title}</p>
                {task.dueTo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(task.dueTo).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge variant="secondary">P{task.priority}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}