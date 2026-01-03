"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A donut chart with countdown timer"

type ChartPieDonutTextProps = {
  remainingSeconds?: number;
  totalSeconds?: number;
  formattedTime?: string;
  percentage?: number;
  remainingColor?: string;
  elapsedColor?: string;
  showLabel?: boolean;
  innerRadius?: number;
  outerRadius?: number;
};

const defaultChartConfig = {
  remaining: {
    label: "Remaining",
    color: "hsl(var(--primary))",
  },
  elapsed: {
    label: "Elapsed",
    color: "rgb(219, 234, 254)", // blue-100
  },
} satisfies ChartConfig

export function ChartPieDonutText({ 
  remainingSeconds = 0,
  totalSeconds = 3600,
  formattedTime = "00:00",
  percentage = 100,
  remainingColor,
  elapsedColor,
  showLabel = true,
  innerRadius = 55,
  outerRadius = 70
}: ChartPieDonutTextProps) {
  // Create chart config with custom colors or defaults
  const chartConfig = React.useMemo(() => ({
    remaining: {
      label: "Remaining",
      color: remainingColor || defaultChartConfig.remaining.color,
    },
    elapsed: {
      label: "Elapsed",
      color: elapsedColor || defaultChartConfig.elapsed.color,
    },
  }), [remainingColor, elapsedColor]) satisfies ChartConfig;

  // Create chart data: remaining (colored) and elapsed
  const chartData = React.useMemo(() => {
    const remaining = remainingSeconds;
    const elapsed = totalSeconds - remainingSeconds;
    
    return [
      { 
        name: "remaining", 
        value: remaining, 
        fill: remainingColor || "hsl(var(--primary))"
      },
      { 
        name: "elapsed", 
        value: elapsed, 
        fill: elapsedColor || "rgb(219, 234, 254)" // blue-100
      },
    ];
  }, [remainingSeconds, totalSeconds, remainingColor, elapsedColor]);

  // Determine text color based on remaining time
  const isWarning = percentage <= 20;
  const isCritical = percentage <= 10;

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardContent className="flex-1 pb-0 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] w-[180px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {showLabel && (
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                            y={(viewBox.cy || 0) - 8}
                            className={`text-2xl font-bold font-geistMono ${
                              isCritical 
                                ? 'fill-red-500' 
                                : isWarning 
                                ? 'fill-orange-500' 
                                : 'fill-foreground'
                            }`}
                        >
                            {formattedTime}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-muted-foreground text-xs"
                        >
                            Remaining
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
              )}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
