"use client"

import { BarChart } from "@/components/ui/chart"

// Mock data
const data = [
  { name: "Week 1", Attendance: 90, Quizzes: 85, Assignments: 78 },
  { name: "Week 2", Attendance: 95, Quizzes: 82, Assignments: 80 },
  { name: "Week 3", Attendance: 85, Quizzes: 90, Assignments: 85 },
  { name: "Week 4", Attendance: 100, Quizzes: 88, Assignments: 90 },
  { name: "Week 5", Attendance: 90, Quizzes: 92, Assignments: 88 },
  { name: "Week 6", Attendance: 95, Quizzes: 95, Assignments: 92 },
]

export function PerformanceChart() {
  // Ensure all data values are numbers
  const formattedData = data.map((item) => ({
    name: item.name,
    Attendance: Number(item.Attendance),
    Quizzes: Number(item.Quizzes),
    Assignments: Number(item.Assignments),
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <BarChart
        data={formattedData}
        index="name"
        categories={["Attendance", "Quizzes", "Assignments"]}
        colors={["#3b82f6", "#8b5cf6", "#22c55e"]}
        showLegend
      />
    </div>
  )
}
