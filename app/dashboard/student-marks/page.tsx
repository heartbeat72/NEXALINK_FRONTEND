"use client"

import { useState, useEffect } from "react"
import { Download, Filter, Plus, Search, Edit, Trash, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock data for student marks
const initialMarksData = [
  {
    id: 1,
    studentId: "S001",
    studentName: "John Smith",
    course: "Introduction to Computer Science",
    courseCode: "CS101",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 26,
    date: "2025-03-01",
    status: "Excellent",
  },
  {
    id: 2,
    studentId: "S002",
    studentName: "Emily Johnson",
    course: "Introduction to Computer Science",
    courseCode: "CS101",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 24,
    date: "2025-03-01",
    status: "Good",
  },
  {
    id: 3,
    studentId: "S003",
    studentName: "Michael Brown",
    course: "Introduction to Computer Science",
    courseCode: "CS101",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 28,
    date: "2025-03-01",
    status: "Excellent",
  },
  {
    id: 4,
    studentId: "S004",
    studentName: "Sarah Davis",
    course: "Introduction to Computer Science",
    courseCode: "CS101",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 22,
    date: "2025-03-01",
    status: "Good",
  },
  {
    id: 5,
    studentId: "S001",
    studentName: "John Smith",
    course: "Data Structures & Algorithms",
    courseCode: "DS201",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 25,
    date: "2025-03-02",
    status: "Good",
  },
  {
    id: 6,
    studentId: "S002",
    studentName: "Emily Johnson",
    course: "Data Structures & Algorithms",
    courseCode: "DS201",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 27,
    date: "2025-03-02",
    status: "Excellent",
  },
  {
    id: 7,
    studentId: "S003",
    studentName: "Michael Brown",
    course: "Data Structures & Algorithms",
    courseCode: "DS201",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 23,
    date: "2025-03-02",
    status: "Good",
  },
  {
    id: 8,
    studentId: "S004",
    studentName: "Sarah Davis",
    course: "Data Structures & Algorithms",
    courseCode: "DS201",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 26,
    date: "2025-03-02",
    status: "Good",
  },
]

export default function StudentMarksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedTest, setSelectedTest] = useState("all")
  const [marksData, setMarksData] = useState(initialMarksData)
  const [isAddMarkDialogOpen, setIsAddMarkDialogOpen] = useState(false)
  const [newMark, setNewMark] = useState({
    studentId: "",
    studentName: "",
    course: "",
    courseCode: "",
    test: "IA Test 1",
    maxMarks: 30,
    obtainedMarks: 0,
    date: new Date().toISOString().split("T")[0],
  })
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Filter marks based on search term, selected course, and selected test
  const filteredMarks = marksData.filter((mark) => {
    const matchesSearch =
      mark.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || mark.course === selectedCourse
    const matchesTest = selectedTest === "all" || mark.test === selectedTest

    return matchesSearch && matchesCourse && matchesTest
  })

  // Get unique courses and tests for filters
  const uniqueCourses = Array.from(new Set(marksData.map((mark) => mark.course)))
  const uniqueTests = Array.from(new Set(marksData.map((mark) => mark.test)))

  const handleAddMark = () => {
    // Validate form
    if (!newMark.studentId || !newMark.studentName || !newMark.course || !newMark.courseCode || !newMark.test) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new mark
    const newId = Math.max(...marksData.map((mark) => mark.id)) + 1
    const markToAdd = {
      ...newMark,
      id: newId,
      status: newMark.obtainedMarks >= 25 ? "Excellent" : newMark.obtainedMarks >= 20 ? "Good" : "Average",
    }

    setMarksData([...marksData, markToAdd])
    setIsAddMarkDialogOpen(false)

    // Reset form
    setNewMark({
      studentId: "",
      studentName: "",
      course: "",
      courseCode: "",
      test: "IA Test 1",
      maxMarks: 30,
      obtainedMarks: 0,
      date: new Date().toISOString().split("T")[0],
    })

    toast({
      title: "Mark added",
      description: `Mark for ${newMark.studentName} has been added successfully.`,
    })
  }

  const handleDeleteMark = (id: number) => {
    setMarksData(marksData.filter((mark) => mark.id !== id))

    toast({
      title: "Mark deleted",
      description: "The mark has been deleted successfully.",
    })
  }

  const handleExportMarks = () => {
    toast({
      title: "Exporting marks",
      description: "The marks are being exported to CSV.",
    })
  }

  if (!user || user.role !== "faculty") {
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
          <h2 className="text-2xl font-bold">Student Marks</h2>
          <p className="text-muted-foreground">Manage and view student assessment marks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExportMarks}>
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="gap-1" onClick={() => setIsAddMarkDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Marks</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
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
              className="h-4 w-4 text-blue-500 dark:text-blue-400"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" x2="8" y1="13" y2="13"></line>
              <line x1="16" x2="8" y1="17" y2="17"></line>
              <line x1="10" x2="8" y1="9" y2="9"></line>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueTests.length}</div>
            <p className="text-xs text-muted-foreground">Assessment tests conducted</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
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
              className="h-4 w-4 text-green-500 dark:text-green-400"
            >
              <path d="M3 3v18h18"></path>
              <path d="M7 12v5"></path>
              <path d="M11 6v11"></path>
              <path d="M15 10v7"></path>
              <path d="M19 5v13"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                marksData.reduce((sum, mark) => sum + (mark.obtainedMarks / mark.maxMarks) * 100, 0) / marksData.length,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all assessments</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Performers</CardTitle>
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
              className="h-4 w-4 text-purple-500 dark:text-purple-400"
            >
              <path d="M12 2v20"></path>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marksData.filter((mark) => mark.status === "Excellent").length}</div>
            <p className="text-xs text-muted-foreground">Students with excellent performance</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
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
              className="h-4 w-4 text-amber-500 dark:text-amber-400"
            >
              <path d="M12 2v4"></path>
              <path d="M12 18v4"></path>
              <path d="M4.93 4.93l2.83 2.83"></path>
              <path d="M16.24 16.24l2.83 2.83"></path>
              <path d="M2 12h4"></path>
              <path d="M18 12h4"></path>
              <path d="M4.93 19.07l2.83-2.83"></path>
              <path d="M16.24 7.76l2.83-2.83"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Assessments to be graded</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Marks</TabsTrigger>
          <TabsTrigger value="cs101">CS101</TabsTrigger>
          <TabsTrigger value="ds201">DS201</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Student Marks</CardTitle>
              <CardDescription>View and manage all student assessment marks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name or ID..."
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMarks.map((mark) => (
                        <TableRow key={mark.id}>
                          <TableCell>{mark.studentId}</TableCell>
                          <TableCell>{mark.studentName}</TableCell>
                          <TableCell>{mark.courseCode}</TableCell>
                          <TableCell>{mark.test}</TableCell>
                          <TableCell>
                            {mark.obtainedMarks} / {mark.maxMarks}
                          </TableCell>
                          <TableCell>{new Date(mark.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                mark.status === "Excellent"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : mark.status === "Good"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {mark.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Mark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteMark(mark.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete Mark</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cs101" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>CS101: Introduction to Computer Science</CardTitle>
              <CardDescription>View and manage marks for Introduction to Computer Science</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marksData
                      .filter((mark) => mark.courseCode === "CS101")
                      .map((mark) => (
                        <TableRow key={mark.id}>
                          <TableCell>{mark.studentId}</TableCell>
                          <TableCell>{mark.studentName}</TableCell>
                          <TableCell>{mark.test}</TableCell>
                          <TableCell>
                            {mark.obtainedMarks} / {mark.maxMarks}
                          </TableCell>
                          <TableCell>{new Date(mark.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                mark.status === "Excellent"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : mark.status === "Good"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {mark.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Mark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteMark(mark.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete Mark</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ds201" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>DS201: Data Structures & Algorithms</CardTitle>
              <CardDescription>View and manage marks for Data Structures & Algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marksData
                      .filter((mark) => mark.courseCode === "DS201")
                      .map((mark) => (
                        <TableRow key={mark.id}>
                          <TableCell>{mark.studentId}</TableCell>
                          <TableCell>{mark.studentName}</TableCell>
                          <TableCell>{mark.test}</TableCell>
                          <TableCell>
                            {mark.obtainedMarks} / {mark.maxMarks}
                          </TableCell>
                          <TableCell>{new Date(mark.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                mark.status === "Excellent"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : mark.status === "Good"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {mark.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Mark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteMark(mark.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete Mark</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Mark Dialog */}
      <Dialog open={isAddMarkDialogOpen} onOpenChange={setIsAddMarkDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Student Mark</DialogTitle>
            <DialogDescription>Enter the details for the student mark you want to add.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., S001"
                  value={newMark.studentId}
                  onChange={(e) => setNewMark({ ...newMark, studentId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="e.g., John Smith"
                  value={newMark.studentName}
                  onChange={(e) => setNewMark({ ...newMark, studentName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS101"
                  value={newMark.courseCode}
                  onChange={(e) => setNewMark({ ...newMark, courseCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course Name</Label>
                <Input
                  id="course"
                  placeholder="e.g., Introduction to Computer Science"
                  value={newMark.course}
                  onChange={(e) => setNewMark({ ...newMark, course: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test">Test</Label>
                <Select value={newMark.test} onValueChange={(value) => setNewMark({ ...newMark, test: value })}>
                  <SelectTrigger id="test">
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IA Test 1">IA Test 1</SelectItem>
                    <SelectItem value="IA Test 2">IA Test 2</SelectItem>
                    <SelectItem value="IA Test 3">IA Test 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMark.date}
                  onChange={(e) => setNewMark({ ...newMark, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxMarks">Maximum Marks</Label>
                <Input
                  id="maxMarks"
                  type="number"
                  value={newMark.maxMarks}
                  onChange={(e) => setNewMark({ ...newMark, maxMarks: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="obtainedMarks">Obtained Marks</Label>
                <Input
                  id="obtainedMarks"
                  type="number"
                  value={newMark.obtainedMarks}
                  onChange={(e) => setNewMark({ ...newMark, obtainedMarks: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMarkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMark}>Add Mark</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
