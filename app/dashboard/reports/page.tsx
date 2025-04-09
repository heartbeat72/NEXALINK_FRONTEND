"use client"

import { useState, useEffect } from "react"
import { Download, Calendar, BarChartIcon as ChartBar, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState("attendance")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("month")
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} report is being generated.`,
    })
  }

  const handleExportReport = () => {
    toast({
      title: "Exporting report",
      description: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} report is being exported to CSV.`,
    })
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You don't have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Generate and view system reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="gap-1" onClick={handleGenerateReport}>
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Average across all courses</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <ChartBar className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4 GPA</div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Course completion rate</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,342</div>
            <p className="text-xs text-muted-foreground">Users this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-background">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Select parameters to generate system reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="performance">Performance Report</SelectItem>
                    <SelectItem value="course">Course Report</SelectItem>
                    <SelectItem value="faculty">Faculty Report</SelectItem>
                    <SelectItem value="student">Student Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="semester">Current Semester</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="attendance"
            value={selectedReportType}
            onValueChange={setSelectedReportType}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="course">Course</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted/50 p-4">
                  <h3 className="text-lg font-medium">Attendance Report</h3>
                  <p className="text-sm text-muted-foreground">Overview of student attendance across courses</p>
                </div>
                <div className="p-4">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center">
                      <ChartBar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select parameters and generate report to view attendance data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted/50 p-4">
                  <h3 className="text-lg font-medium">Performance Report</h3>
                  <p className="text-sm text-muted-foreground">Analysis of student academic performance</p>
                </div>
                <div className="p-4">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center">
                      <ChartBar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select parameters and generate report to view performance data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="course" className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted/50 p-4">
                  <h3 className="text-lg font-medium">Course Report</h3>
                  <p className="text-sm text-muted-foreground">Statistics and analytics for courses</p>
                </div>
                <div className="p-4">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select parameters and generate report to view course data</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faculty" className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted/50 p-4">
                  <h3 className="text-lg font-medium">Faculty Report</h3>
                  <p className="text-sm text-muted-foreground">Performance and workload analysis for faculty members</p>
                </div>
                <div className="p-4">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select parameters and generate report to view faculty data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="student" className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted/50 p-4">
                  <h3 className="text-lg font-medium">Student Report</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive student statistics and demographics</p>
                </div>
                <div className="p-4">
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="text-center">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select parameters and generate report to view student data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
