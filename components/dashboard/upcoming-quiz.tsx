"use client"

import { Clock, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function UpcomingQuizCard() {
  // Mock data
  const quizzes = [
    {
      id: 1,
      title: "Data Structures: Graph Algorithms",
      dueDate: "Tomorrow, 3:00 PM",
      questions: 10,
      timeLimit: 20,
      readiness: 85,
    },
    {
      id: 2,
      title: "Database Systems: SQL Queries",
      dueDate: "March 15, 10:00 AM",
      questions: 15,
      timeLimit: 30,
      readiness: 70,
    },
    {
      id: 3,
      title: "Artificial Intelligence: Neural Networks",
      dueDate: "March 18, 2:00 PM",
      questions: 12,
      timeLimit: 25,
      readiness: 60,
    },
  ]

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="rounded-lg border p-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{quiz.title}</h4>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{quiz.dueDate}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span className="text-xs">Start</span>
            </Button>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span>Readiness</span>
              <span>{quiz.readiness}%</span>
            </div>
            <Progress value={quiz.readiness} className="h-1.5 mt-1" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{quiz.questions} Questions</span>
            <span>{quiz.timeLimit} Minutes</span>
          </div>
        </div>
      ))}
    </div>
  )
}
