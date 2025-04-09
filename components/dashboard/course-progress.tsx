"use client"

import { LineChart } from "@/components/ui/chart"

// Mock data
const data = [
  { name: "Week 1", "Computer Science": 85, "Data Structures": 78, AI: 90 },
  { name: "Week 2", "Computer Science": 88, "Data Structures": 80, AI: 85 },
  { name: "Week 3", "Computer Science": 90, "Data Structures": 85, AI: 88 },
  { name: "Week 4", "Computer Science": 92, "Data Structures": 88, AI: 92 },
  { name: "Week 5", "Computer Science": 90, "Data Structures": 92, AI: 95 },
  { name: "Week 6", "Computer Science": 95, "Data Structures": 90, AI: 98 },
]

export function CourseProgressCard() {
  // Ensure all data values are numbers
  const formattedData = data.map((item) => ({
    name: item.name,
    "Computer Science": Number(item["Computer Science"]),
    "Data Structures": Number(item["Data Structures"]),
    AI: Number(item.AI),
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <LineChart
        data={formattedData}
        index="name"
        categories={["Computer Science", "Data Structures", "AI"]}
        colors={["#3b82f6", "#22c55e", "#8b5cf6"]}
        showLegend
      />
    </div>
  )
}
