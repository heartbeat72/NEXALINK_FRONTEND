"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash, MoreHorizontal, BookOpen, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Mock data for courses
const initialCoursesData = [
  {
    id: 1,
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    department: "Computer Science",
    credits: 4,
    semester: "Fall 2025",
    faculty: "Dr. Alan Turing",
    students: 42,
    status: "Active",
    description:
      "An introductory course to computer science covering basic programming concepts, algorithms, and data structures.",
  },
  {
    id: 2,
    courseCode: "DS201",
    courseName: "Data Structures & Algorithms",
    department: "Computer Science",
    credits: 4,
    semester: "Fall 2025",
    faculty: "Dr. Katherine Johnson",
    students: 38,
    status: "Active",
    description:
      "A comprehensive study of data structures and algorithms, including analysis of algorithm efficiency and complexity.",
  },
  {
    id: 3,
    courseCode: "AI301",
    courseName: "Artificial Intelligence",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2025",
    faculty: "Dr. Alan Turing",
    students: 35,
    status: "Active",
    description: "Introduction to artificial intelligence concepts, machine learning algorithms, and neural networks.",
  },
  {
    id: 4,
    courseCode: "DB201",
    courseName: "Database Systems",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2025",
    faculty: "Dr. Grace Hopper",
    students: 40,
    status: "Active",
    description: "Fundamentals of database design, SQL, normalization, and database management systems.",
  },
  {
    id: 5,
    courseCode: "MATH102",
    courseName: "Calculus II",
    department: "Mathematics",
    credits: 4,
    semester: "Fall 2025",
    faculty: "Dr. Katherine Johnson",
    students: 45,
    status: "Active",
    description: "Advanced calculus topics including integration techniques, sequences, series, and applications.",
  },
  {
    id: 6,
    courseCode: "PHY101",
    courseName: "Physics I",
    department: "Physics",
    credits: 4,
    semester: "Fall 2025",
    faculty: "Dr. Richard Feynman",
    students: 50,
    status: "Active",
    description: "Introduction to classical mechanics, kinematics, Newton's laws, energy, and momentum.",
  },
]

export default function CoursesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [coursesData, setCoursesData] = useState(initialCoursesData)
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2025",
    faculty: "",
    status: "Active",
    description: "",
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

  // Filter courses based on search term, selected department, and selected semester
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester

    return matchesSearch && matchesDepartment && matchesSemester
  })

  // Get unique departments and semesters for filters
  const uniqueDepartments = Array.from(new Set(coursesData.map((course) => course.department)))
  const uniqueSemesters = Array.from(new Set(coursesData.map((course) => course.semester)))

  const handleAddCourse = () => {
    // Validate form
    if (!newCourse.courseCode || !newCourse.courseName || !newCourse.department || !newCourse.faculty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new course
    const newId = Math.max(...coursesData.map((course) => course.id)) + 1
    const courseToAdd = {
      ...newCourse,
      id: newId,
      students: 0,
    }

    setCoursesData([...coursesData, courseToAdd])
    setIsAddCourseDialogOpen(false)

    // Reset form
    setNewCourse({
      courseCode: "",
      courseName: "",
      department: "Computer Science",
      credits: 3,
      semester: "Fall 2025",
      faculty: "",
      status: "Active",
      description: "",
    })

    toast({
      title: "Course added",
      description: `${newCourse.courseCode}: ${newCourse.courseName} has been added successfully.`,
    })
  }

  const handleDeleteCourse = (id: number) => {
    setCoursesData(coursesData.filter((course) => course.id !== id))

    toast({
      title: "Course deleted",
      description: "The course has been deleted successfully.",
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
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">Manage courses and their information</p>
        </div>
        <Button className="gap-1" onClick={() => setIsAddCourseDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesData.length}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesData.reduce((sum, course) => sum + course.students, 0)}</div>
            <p className="text-xs text-muted-foreground">Enrolled in courses</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
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
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDepartments.length}</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Fall 2025</div>
            <p className="text-xs text-muted-foreground">Active semester</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Course Directory</CardTitle>
              <CardDescription>View and manage all courses</CardDescription>
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
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {uniqueDepartments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {uniqueSemesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.length === 0 ? (
                  <div className="col-span-full text-center py-4">No courses found matching your search criteria</div>
                ) : (
                  filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{course.courseName}</CardTitle>
                            <CardDescription>
                              {course.courseCode} • {course.department}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Course</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteCourse(course.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete Course</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
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
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>Faculty: {course.faculty}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{course.students} Students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Semester: {course.semester}</span>
                          </div>
                          <div className="flex items-center gap-2">
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
                              <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                              <path d="M12 8v4l3 3"></path>
                            </svg>
                            <span>Credits: {course.credits}</span>
                          </div>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}
                            >
                              {course.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 p-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Students
                        </Button>
                        <Button size="sm">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Course List</CardTitle>
              <CardDescription>View and manage all courses in a table format</CardDescription>
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
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {uniqueDepartments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {uniqueSemesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
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
                      <TableHead>Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No courses found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>{course.courseName}</TableCell>
                          <TableCell>{course.department}</TableCell>
                          <TableCell>{course.faculty}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}
                            >
                              {course.status}
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
                                  <span>Edit Course</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteCourse(course.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete Course</span>
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
      </Tabs>

      {/* Add Course Dialog */}
      <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Enter the details for the new course you want to add.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS101"
                  value={newCourse.courseCode}
                  onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Select
                  value={newCourse.credits.toString()}
                  onValueChange={(value) => setNewCourse({ ...newCourse, credits: Number.parseInt(value) })}
                >
                  <SelectTrigger id="credits">
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                placeholder="e.g., Introduction to Computer Science"
                value={newCourse.courseName}
                onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newCourse.department}
                  onValueChange={(value) => setNewCourse({ ...newCourse, department: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={newCourse.semester}
                  onValueChange={(value) => setNewCourse({ ...newCourse, semester: value })}
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                    <SelectItem value="Summer 2026">Summer 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select
                value={newCourse.faculty}
                onValueChange={(value) => setNewCourse({ ...newCourse, faculty: value })}
              >
                <SelectTrigger id="faculty">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Alan Turing">Dr. Alan Turing</SelectItem>
                  <SelectItem value="Dr. Katherine Johnson">Dr. Katherine Johnson</SelectItem>
                  <SelectItem value="Dr. Richard Feynman">Dr. Richard Feynman</SelectItem>
                  <SelectItem value="Dr. Grace Hopper">Dr. Grace Hopper</SelectItem>
                  <SelectItem value="Dr. Marie Curie">Dr. Marie Curie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description of the course"
                className="min-h-[100px]"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCourseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCourse}>Add Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
