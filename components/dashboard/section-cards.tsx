"use client"

import type { Task } from "@/lib/types/task"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CircleCheckIcon, CircleIcon, BarChart3Icon } from "lucide-react"
export function SectionCards({ tasks }: { tasks: Task[] }) {
  const tasksDone = tasks.filter((t) => t.concluded).length
  // Tasks to do = not concluded
  const tasksToDo = tasks.filter((t) => !t.concluded).length

  // Mean of priority = sum(priorities) / count(priorities)
  const priorities = tasks
    .map((t) => t.priority)
    .filter((n): n is number => typeof n === "number")
  const meanPriority = priorities.length
    ? (priorities.reduce((a, b) => a + b, 0) / priorities.length).toFixed(1)
    : "—"

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Tasks Done</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {tasksDone}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Tasks to Do</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {tasksToDo}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Mean of Priority</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {meanPriority}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}