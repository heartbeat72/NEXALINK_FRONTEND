"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Edit, Filter, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useToast } from "@/hooks/use-toast"

// Mock data for classes
const classesData = [
  {
    id: 1,
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    schedule: "Mon, Wed, Fri 9:00 AM - 10:30 AM",
    room: "Room 101",
    students: 42,
    semester: "Spring 2025",
  },
  {
    id: 2,
    courseCode: "DS201",
    courseName: "Data Structures & Algorithms",
    schedule: "Tue, Thu 11:00 AM - 12:30 PM",
    room: "Room 203",
    students: 38,
    semester: "Spring 2025",
  },
  {
    id: 3,
    courseCode: "AI301",
    courseName: "Artificial Intelligence",
    schedule: "Mon, Wed 2:00 PM - 3:30 PM",
    room: "Room 305",
    students: 35,
    semester: "Spring 2025",
  },
  {
    id: 4,
    courseCode: "DB201",
    courseName: "Database Systems",
    schedule: "Tue, Thu 9:00 AM - 10:30 AM",
    room: "Room 202",
    students: 40,
    semester: "Spring 2025",
  },
  {
    id: 5,
    courseCode: "WD101",
    courseName: "Web Development",
    schedule: "Fri 11:00 AM - 2:00 PM",
    room: "Room 104",
    students: 45,
    semester: "Spring 2025",
  },
  {
    id: 6,
    courseCode: "ML401",
    courseName: "Machine Learning",
    schedule: "Mon, Wed 4:00 PM - 5:30 PM",
    room: "Room 301",
    students: 32,
    semester: "Spring 2025",
  },
]

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false)
  const [newClass, setNewClass] = useState({
    courseCode: "",
    courseName: "",
    schedule: "",
    room: "",
    semester: "Spring 2025",
  })
  const [classes, setClasses] = useState(classesData)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Filter classes based on search term and selected semester
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester = selectedSemester === "all" || cls.semester === selectedSemester

    return matchesSearch && matchesSemester
  })

  // Get unique semesters for filter
  const uniqueSemesters = Array.from(new Set(classes.map((cls) => cls.semester)))

  const handleAddClass = () => {
    // Validate form
    if (!newClass.courseCode || !newClass.courseName || !newClass.schedule || !newClass.room) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new class
    const newId = Math.max(...classes.map((cls) => cls.id)) + 1
    const classToAdd = {
      ...newClass,
      id: newId,
      students: 0, // New class has no students yet
    }

    setClasses([...classes, classToAdd])
    setIsAddClassDialogOpen(false)

    // Reset form
    setNewClass({
      courseCode: "",
      courseName: "",
      schedule: "",
      room: "",
      semester: "Spring 2025",
    })

    toast({
      title: "Class added",
      description: `${newClass.courseCode}: ${newClass.courseName} has been added successfully.`,
    })
  }

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter((cls) => cls.id !== id))

    toast({
      title: "Class deleted",
      description: "The class has been deleted successfully.",
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
          <h2 className="text-2xl font-bold">My Classes</h2>
          <p className="text-muted-foreground">Manage your classes and course schedules</p>
        </div>
        <Button className="gap-1" onClick={() => setIsAddClassDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add New Class</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Active classes this semester</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((sum, cls) => sum + cls.students, 0)}</div>
            <p className="text-xs text-muted-foreground">Enrolled in your classes</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
            <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Hours per week</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Classes today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Classes</TabsTrigger>
          <TabsTrigger value="today">Today's Classes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Class List</CardTitle>
              <CardDescription>View and manage all your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 w-full md:w-[300px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="h-8 w-[180px]">
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
                {filteredClasses.length === 0 ? (
                  <div className="col-span-full text-center py-4">No classes found matching your search criteria</div>
                ) : (
                  filteredClasses.map((cls) => (
                    <Card key={cls.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{cls.courseName}</CardTitle>
                            <CardDescription>{cls.courseCode}</CardDescription>
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
                                <span>Edit Class</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClass(cls.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete Class</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{cls.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 flex items-center justify-center text-muted-foreground">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 3v18h18"></path>
                                <path d="M7 12v5"></path>
                                <path d="M11 6v11"></path>
                                <path d="M15 10v7"></path>
                                <path d="M19 5v13"></path>
                              </svg>
                            </div>
                            <span>{cls.room}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{cls.students} Students</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 p-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Attendance
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

        <TabsContent value="today" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
              <CardDescription>Classes scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Introduction to Computer Science</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 10:30 AM • Room 101</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Attendance
                    </Button>
                    <Button size="sm">Start Class</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-l-4 border-green-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Data Structures & Algorithms</p>
                    <p className="text-sm text-muted-foreground">11:00 AM - 12:30 PM • Room 203</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Attendance
                    </Button>
                    <Button size="sm">Start Class</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-l-4 border-purple-500 pl-3 py-2">
                  <div>
                    <p className="font-medium">Artificial Intelligence</p>
                    <p className="text-sm text-muted-foreground">2:00 PM - 3:30 PM • Room 305</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Attendance
                    </Button>
                    <Button size="sm">Start Class</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Classes scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Tomorrow</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3 py-2">
                      <div>
                        <p className="font-medium">Database Systems</p>
                        <p className="text-sm text-muted-foreground">9:00 AM - 10:30 AM • Room 202</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-l-4 border-red-500 pl-3 py-2">
                      <div>
                        <p className="font-medium">Web Development</p>
                        <p className="text-sm text-muted-foreground">11:00 AM - 12:30 PM • Room 104</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Monday, March 15</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-2">
                      <div>
                        <p className="font-medium">Introduction to Computer Science</p>
                        <p className="text-sm text-muted-foreground">9:00 AM - 10:30 AM • Room 101</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-l-4 border-purple-500 pl-3 py-2">
                      <div>
                        <p className="font-medium">Artificial Intelligence</p>
                        <p className="text-sm text-muted-foreground">2:00 PM - 3:30 PM • Room 305</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Class Dialog */}
      <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>Enter the details for the new class you want to add.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS101"
                  value={newClass.courseCode}
                  onChange={(e) => setNewClass({ ...newClass, courseCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={newClass.semester}
                  onValueChange={(value) => setNewClass({ ...newClass, semester: value })}
                >
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                placeholder="e.g., Introduction to Computer Science"
                value={newClass.courseName}
                onChange={(e) => setNewClass({ ...newClass, courseName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                placeholder="e.g., Mon, Wed, Fri 9:00 AM - 10:30 AM"
                value={newClass.schedule}
                onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="e.g., Room 101"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of the course"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClassDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClass}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
