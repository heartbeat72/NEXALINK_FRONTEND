"use client"

import { Bell, BookOpen, Calendar, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotificationsCard() {
  // Mock data
  const notifications = [
    {
      id: 1,
      type: "announcement",
      title: "New Course Materials Available",
      message: "New lecture notes for Database Systems have been uploaded.",
      time: "2 hours ago",
      icon: BookOpen,
    },
    {
      id: 2,
      type: "reminder",
      title: "Quiz Reminder",
      message: "Don't forget about your Data Structures quiz tomorrow at 10:00 AM.",
      time: "5 hours ago",
      icon: FileText,
    },
    {
      id: 3,
      type: "schedule",
      title: "Class Schedule Change",
      message: "Your Artificial Intelligence class on Friday has been moved to Room 302.",
      time: "Yesterday",
      icon: Calendar,
    },
    {
      id: 4,
      type: "announcement",
      title: "University Announcement",
      message: "The library will be closed this weekend for maintenance.",
      time: "2 days ago",
      icon: Bell,
    },
  ]

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="rounded-lg border p-3">
          <div className="flex items-start gap-3">
            <div
              className={`rounded-full p-2 ${
                notification.type === "announcement"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : notification.type === "reminder"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              <notification.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h4 className="font-medium">{notification.title}</h4>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Dismiss
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
