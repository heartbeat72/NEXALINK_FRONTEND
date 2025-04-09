"use client"

import { LineChart } from "@/components/ui/chart"

// Mock data
const data = [
  { name: "Monday", "Study Hours": 3.5, Productivity: 85 },
  { name: "Tuesday", "Study Hours": 4.2, Productivity: 90 },
  { name: "Wednesday", "Study Hours": 2.8, Productivity: 75 },
  { name: "Thursday", "Study Hours": 5.0, Productivity: 95 },
  { name: "Friday", "Study Hours": 3.0, Productivity: 80 },
  { name: "Saturday", "Study Hours": 1.5, Productivity: 70 },
  { name: "Sunday", "Study Hours": 2.0, Productivity: 75 },
]

export function StudyTimeChart() {
  // Ensure all data values are numbers
  const formattedData = data.map((item) => ({
    name: item.name,
    "Study Hours": Number(item["Study Hours"]),
    Productivity: Number(item.Productivity),
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <LineChart
        data={formattedData}
        index="name"
        categories={["Study Hours", "Productivity"]}
        colors={["#3b82f6", "#22c55e"]}
        showLegend
      />
    </div>
  )
}
