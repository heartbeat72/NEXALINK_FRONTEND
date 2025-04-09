"use client"

import { BarChart } from "@/components/ui/chart"

// Mock data
const data = [
  { name: "Computer Science", Present: 92, Absent: 8 },
  { name: "Data Structures", Present: 85, Absent: 15 },
  { name: "Artificial Intelligence", Present: 95, Absent: 5 },
  { name: "Database Systems", Present: 88, Absent: 12 },
  { name: "Web Development", Present: 90, Absent: 10 },
]

export function AttendanceChart() {
  // Ensure all data values are numbers
  const formattedData = data.map((item) => ({
    name: item.name,
    Present: Number(item.Present),
    Absent: Number(item.Absent),
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <BarChart
        data={formattedData}
        index="name"
        categories={["Present", "Absent"]}
        colors={["#22c55e", "#ef4444"]}
        showLegend
      />
    </div>
  )
}
