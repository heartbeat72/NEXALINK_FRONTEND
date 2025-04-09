"use client"

import { PieChart } from "@/components/ui/chart"

// Mock data
const data = [
  { name: "A", value: 35 },
  { name: "B", value: 40 },
  { name: "C", value: 15 },
  { name: "D", value: 10 },
]

export function GradeDistributionChart() {
  // Make sure data is properly formatted
  const formattedData = data.map((item) => ({
    ...item,
    value: Number(item.value), // Ensure value is a number
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <PieChart
        data={formattedData}
        index="name"
        categories={["value"]}
        colors={["#22c55e", "#3b82f6", "#eab308", "#ef4444"]}
        showLegend
      />
    </div>
  )
}
