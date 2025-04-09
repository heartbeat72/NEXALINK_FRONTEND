"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, BookOpen, Calendar, BarChartIcon as ChartBar, FileText, Users, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [user, setUser] = useState<{
    firstName: string
    lastName: string
    role: string
    email: string
  } | null>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Render appropriate dashboard based on user role
  if (!user) {
    return <div>Loading...</div>
  }

  if (user.role === "student") {
    return <StudentDashboard user={user} />
  } else if (user.role === "faculty") {
    return <FacultyDashboard user={user} />
  } else if (user.role === "admin") {
    return <AdminDashboard user={user} />
  }

  return <div>Unknown user role</div>
}

// Student Dashboard
function StudentDashboard({ user }: { user: any }) {
  // Stats data
  const stats = [
    {
      id: 1,
      title: "Your Courses",
      value: "4",
      description: "Current semester",
      icon: BookOpen,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Average Attendance",
      value: "85%",
      description: "Across all courses",
      icon: Calendar,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      id: 3,
      title: "Assignments Due",
      value: "3",
      description: "This week",
      icon: FileText,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500 dark:text-red-400",
    },
    {
      id: 4,
      title: "Average Grade",
      value: "3.7 GPA",
      description: "Current semester",
      icon: ChartBar,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500 dark:text-purple-400",
    },
  ]

  // Recent announcements
  const announcements = [
    {
      id: 1,
      title: "Library Hours Extended for Finals Week",
      description:
        "The university library will extend its hours during finals week. The library will be open from 7 AM to midnight from December 10-17.",
      date: "2025-03-01",
      icon: Bell,
    },
    {
      id: 2,
      title: "Campus Closed for Maintenance",
      description:
        "The main campus will be closed on Saturday, October 15 for scheduled maintenance. All classes will be conducted online.",
      date: "2025-02-28",
      icon: Bell,
      important: true,
    },
  ]

  // Quick links
  const quickLinks = [
    { id: 1, title: "View My Profile", href: "/dashboard/settings" },
    { id: 2, title: "View Attendance Report", href: "/dashboard/attendance" },
    { id: 3, title: "View Marks Report", href: "/dashboard/ia-marks" },
    { id: 4, title: "Academic Calendar", href: "#" },
    { id: 5, title: "Support & Help", href: "#" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || "User"}</h1>
        <p className="text-muted-foreground">Here's what's happening in your academic portal today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className={`${stat.bgColor} border-none`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Announcements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-white dark:bg-background">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <announcement.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{announcement.title}</h3>
                      {announcement.important && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{announcement.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Posted on {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.id} href={link.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer bg-white dark:bg-background">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{link.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Faculty Dashboard
function FacultyDashboard({ user }: { user: any }) {
  // Stats data for faculty
  const stats = [
    {
      id: 1,
      title: "Your Courses",
      value: "6",
      description: "Current semester",
      icon: BookOpen,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Total Students",
      value: "248",
      description: "In your courses",
      icon: Users,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      id: 3,
      title: "Classes This Week",
      value: "12",
      description: "Across all your courses",
      icon: Calendar,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500 dark:text-purple-400",
    },
    {
      id: 4,
      title: "Pending Assessments",
      value: "4",
      description: "To be graded",
      icon: FileText,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500 dark:text-amber-400",
    },
  ]

  // Recent announcements
  const announcements = [
    {
      id: 1,
      title: "Faculty Meeting Scheduled",
      description:
        "There will be a faculty meeting on Friday at 2 PM in the Conference Hall to discuss the upcoming semester planning.",
      date: "2025-03-01",
      icon: Bell,
    },
    {
      id: 2,
      title: "Exam Schedule Released",
      description:
        "The final examination schedule has been released. Please review and confirm your assigned invigilation duties.",
      date: "2025-02-28",
      icon: Bell,
      important: true,
    },
  ]

  // Quick links for faculty
  const quickLinks = [
    { id: 1, title: "View My Profile", href: "/dashboard/settings" },
    { id: 2, title: "Manage Classes", href: "/dashboard/classes" },
    { id: 3, title: "Grade Assignments", href: "/dashboard/student-marks" },
    { id: 4, title: "Upload Study Materials", href: "/dashboard/upload-materials" },
    { id: 5, title: "View Student Feedback", href: "/dashboard/student-feedback" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || "User"}</h1>
        <p className="text-muted-foreground">Here's what's happening in your academic portal today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className={`${stat.bgColor} border-none`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Announcements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-white dark:bg-background">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <announcement.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{announcement.title}</h3>
                      {announcement.important && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{announcement.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Posted on {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.id} href={link.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer bg-white dark:bg-background">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{link.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Classes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Introduction to Computer Science</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 10:30 AM • Room 101</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between border-l-4 border-green-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Data Structures & Algorithms</p>
                    <p className="text-sm text-muted-foreground">11:00 AM - 12:30 PM • Room 203</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between border-l-4 border-purple-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Artificial Intelligence</p>
                    <p className="text-sm text-muted-foreground">2:00 PM - 3:30 PM • Room 305</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="text-lg">Tomorrow's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Database Systems</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 10:30 AM • Room 202</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between border-l-4 border-red-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Web Development</p>
                    <p className="text-sm text-muted-foreground">11:00 AM - 12:30 PM • Room 104</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Faculty Meeting</p>
                    <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM • Conference Hall</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard
function AdminDashboard({ user }: { user: any }) {
  // Stats data for admin
  const stats = [
    {
      id: 1,
      title: "Total Students",
      value: "1,248",
      description: "Enrolled this semester",
      icon: Users,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Total Faculty",
      value: "86",
      description: "Active faculty members",
      icon: GraduationCap,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      id: 3,
      title: "Active Courses",
      value: "42",
      description: "This semester",
      icon: BookOpen,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500 dark:text-purple-400",
    },
    {
      id: 4,
      title: "System Alerts",
      value: "3",
      description: "Require attention",
      icon: Bell,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500 dark:text-red-400",
    },
  ]

  // Recent announcements
  const announcements = [
    {
      id: 1,
      title: "New Semester Registration Open",
      description:
        "Registration for the Fall 2025 semester is now open. Please ensure all faculty members have updated their course information.",
      date: "2025-03-01",
      icon: Bell,
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      description:
        "The academic portal will be undergoing maintenance on Saturday from 10 PM to 2 AM. Please inform all users about potential downtime.",
      date: "2025-02-28",
      icon: Bell,
      important: true,
    },
  ]

  // Quick links for admin
  const quickLinks = [
    { id: 1, title: "Manage Faculty", href: "/dashboard/faculty" },
    { id: 2, title: "Manage Students", href: "/dashboard/students" },
    { id: 3, title: "Manage Courses", href: "/dashboard/courses" },
    { id: 4, title: "View Reports", href: "/dashboard/reports" },
    { id: 5, title: "System Settings", href: "/dashboard/system-settings" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || "Admin"}</h1>
        <p className="text-muted-foreground">Here's an overview of your academic management system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className={`${stat.bgColor} border-none`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Announcements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-white dark:bg-background">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <announcement.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{announcement.title}</h3>
                      {announcement.important && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{announcement.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Posted on {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.id} href={link.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer bg-white dark:bg-background">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{link.title}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">System Status</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="text-lg">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Students Online</span>
                  <span className="font-medium">342</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "27%" }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Faculty Online</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "32%" }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Admin Online</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "62%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="text-lg">System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-red-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Database Storage at 85%</p>
                    <p className="text-sm text-muted-foreground">Consider optimizing or expanding storage</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                </div>
                <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Backup Scheduled</p>
                    <p className="text-sm text-muted-foreground">Next backup in 6 hours</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">System Update Available</p>
                    <p className="text-sm text-muted-foreground">Version 2.4.1 ready to install</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
