"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { Task } from "@/lib/types/task"

export const description = "Tasks done vs tasks to do over time"

type TasksOverTimePoint = {
  date: string
  done: number
  toDo: number
}

const chartConfig = {
  done: {
    label: "Tasks done",
    color: "var(--primary)",
  },
  toDo: {
    label: "Tasks to do",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

function buildTasksOverTime(
  tasks: Task[],
  timeRange: "7d" | "30d" | "90d",
): TasksOverTimePoint[] {
  const today = new Date()
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90

  // Normalize date to yyyy-mm-dd
  const toKey = (d: Date) => d.toISOString().slice(0, 10)

  const start = new Date(today)
  start.setDate(start.getDate() - (days - 1))

  const countsByDay = new Map<string, { done: number; toDo: number }>()

  for (const task of tasks) {
    if (!task.createdOn) continue
    const created = new Date(task.createdOn)
    if (created < start || created > today) continue
    const key = toKey(created)
    const current = countsByDay.get(key) ?? { done: 0, toDo: 0 }
    if (task.concluded) {
      current.done += 1
    } else {
      current.toDo += 1
    }
    countsByDay.set(key, current)
  }

  const points: TasksOverTimePoint[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = toKey(d)
    const counts = countsByDay.get(key) ?? { done: 0, toDo: 0 }
    points.push({
      date: key,
      done: counts.done,
      toDo: counts.toDo,
    })
  }

  return points
}

export function ChartAreaInteractive({ tasks }: { tasks: Task[] }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const chartData = React.useMemo(
    () => buildTasksOverTime(tasks, timeRange),
    [tasks, timeRange],
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tasks over time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tasks done vs to do for the selected period
          </span>
          <span className="@[540px]/card:hidden">
            Tasks done vs to do
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value === "7d" || value === "30d" || value === "90d") {
                setTimeRange(value)
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value === "7d" || value === "30d" || value === "90d") {
                setTimeRange(value)
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDone" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-done)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-done)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillToDo" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-toDo)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-toDo)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="toDo"
              type="natural"
              fill="url(#fillToDo)"
              stroke="var(--color-toDo)"
              stackId="a"
            />
            <Area
              dataKey="done"
              type="natural"
              fill="url(#fillDone)"
              stroke="var(--color-done)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
