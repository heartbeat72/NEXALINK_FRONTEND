"use client"

import { useState, useEffect } from "react"
import { FileText, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Mock data
const iaMarksData = [
  {
    id: 1,
    course: "Introduction to Computer Science",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 26,
    date: "2025-03-01",
    status: "Excellent",
  },
  {
    id: 2,
    course: "Data Structures & Algorithms",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 24,
    date: "2025-03-02",
    status: "Good",
  },
  {
    id: 3,
    course: "Artificial Intelligence",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 28,
    date: "2025-03-03",
    status: "Excellent",
  },
  {
    id: 4,
    course: "Database Systems",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 22,
    date: "2025-03-04",
    status: "Good",
  },
  {
    id: 5,
    course: "Web Development",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 25,
    date: "2025-03-05",
    status: "Good",
  },
  {
    id: 6,
    course: "Introduction to Computer Science",
    test: "IA Test 2",
    maxMarks: 30,
    obtainedMarks: 27,
    date: "2025-04-01",
    status: "Excellent",
  },
  {
    id: 7,
    course: "Data Structures & Algorithms",
    test: "IA Test 2",
    maxMarks: 30,
    obtainedMarks: 25,
    date: "2025-04-02",
    status: "Good",
  },
  {
    id: 8,
    course: "Artificial Intelligence",
    test: "IA Test 2",
    maxMarks: 30,
    obtainedMarks: 29,
    date: "2025-04-03",
    status: "Excellent",
  },
  {
    id: 9,
    course: "Database Systems",
    test: "IA Test 2",
    maxMarks: 30,
    obtainedMarks: 23,
    date: "2025-04-04",
    status: "Good",
  },
  {
    id: 10,
    course: "Web Development",
    test: "IA Test 2",
    maxMarks: 30,
    obtainedMarks: 26,
    date: "2025-04-05",
    status: "Good",
  },
]

export default function IAMarksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedTest, setSelectedTest] = useState("all")
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get user role from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      const { role } = JSON.parse(user)
      setUserRole(role)
    }
  }, [])

  const filteredData = iaMarksData.filter((item) => {
    const matchesSearch = item.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || item.course === selectedCourse
    const matchesTest = selectedTest === "all" || item.test === selectedTest

    return matchesSearch && matchesCourse && matchesTest
  })

  const uniqueCourses = Array.from(new Set(iaMarksData.map((item) => item.course)))
  const uniqueTests = Array.from(new Set(iaMarksData.map((item) => item.test)))

  // Calculate average marks
  const totalMarks = iaMarksData.reduce((sum, item) => sum + item.obtainedMarks, 0)
  const totalMaxMarks = iaMarksData.reduce((sum, item) => sum + item.maxMarks, 0)
  const averagePercentage = Math.round((totalMarks / totalMaxMarks) * 100)

  const handleCalendarView = () => {
    toast({
      title: "Calendar View",
      description: "Switching to calendar view...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Internal Assessment Marks</h2>
          <p className="text-muted-foreground">View and track your IA test performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleCalendarView}>
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
              className="h-4 w-4"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            <span className="hidden sm:inline">Calendar View</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePercentage}%</div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${averagePercentage}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...iaMarksData.map((item) => item.obtainedMarks))} / 30</div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(Math.max(...iaMarksData.map((item) => item.obtainedMarks)) / 30) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{iaMarksData.length}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Rating</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averagePercentage >= 90 ? "Excellent" : averagePercentage >= 75 ? "Good" : "Average"}
            </div>
            <p className="text-xs text-muted-foreground">Based on overall performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-tests">All Tests</TabsTrigger>
          <TabsTrigger value="test1">IA Test 1</TabsTrigger>
          <TabsTrigger value="test2">IA Test 2</TabsTrigger>
        </TabsList>
        <TabsContent value="all-tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IA Test Records</CardTitle>
              <CardDescription>View your internal assessment test records for all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 w-full md:w-[300px]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {uniqueCourses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={selectedTest} onValueChange={setSelectedTest}>
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Select test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tests</SelectItem>
                      {uniqueTests.map((test) => (
                        <SelectItem key={test} value={test}>
                          {test}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Test
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Marks
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.test}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.obtainedMarks} / {item.maxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                item.status === "Excellent"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : item.status === "Good"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IA Test 1 Records</CardTitle>
              <CardDescription>View your internal assessment test 1 records for all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Marks
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {iaMarksData
                      .filter((item) => item.test === "IA Test 1")
                      .map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.obtainedMarks} / {item.maxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                item.status === "Excellent"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : item.status === "Good"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IA Test 2 Records</CardTitle>
              <CardDescription>View your internal assessment test 2 records for all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Marks
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {iaMarksData
                      .filter((item) => item.test === "IA Test 2")
                      .map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{item.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.obtainedMarks} / {item.maxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                item.status === "Excellent"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : item.status === "Good"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
