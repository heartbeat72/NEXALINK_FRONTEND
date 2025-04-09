"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Mock data for faculty members
const initialFacultyData = [
  {
    id: 1,
    name: "Dr. Alan Turing",
    email: "alan.turing@example.com",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    designation: "Professor",
    joinDate: "2020-01-15",
    status: "Active",
    courses: ["CS101", "AI301"],
    profilePicture: "",
  },
  {
    id: 2,
    name: "Dr. Katherine Johnson",
    email: "katherine.johnson@example.com",
    phone: "+1 (555) 234-5678",
    department: "Mathematics",
    designation: "Associate Professor",
    joinDate: "2019-08-10",
    status: "Active",
    courses: ["MATH102", "DS201"],
    profilePicture: "",
  },
  {
    id: 3,
    name: "Dr. Richard Feynman",
    email: "richard.feynman@example.com",
    phone: "+1 (555) 345-6789",
    department: "Physics",
    designation: "Professor",
    joinDate: "2018-05-20",
    status: "Active",
    courses: ["PHY101", "PHY201"],
    profilePicture: "",
  },
  {
    id: 4,
    name: "Dr. Grace Hopper",
    email: "grace.hopper@example.com",
    phone: "+1 (555) 456-7890",
    department: "Computer Science",
    designation: "Professor",
    joinDate: "2017-09-01",
    status: "On Leave",
    courses: ["CS201", "CS301"],
    profilePicture: "",
  },
  {
    id: 5,
    name: "Dr. Marie Curie",
    email: "marie.curie@example.com",
    phone: "+1 (555) 567-8901",
    department: "Chemistry",
    designation: "Professor",
    joinDate: "2019-03-15",
    status: "Active",
    courses: ["CHEM101", "CHEM201"],
    profilePicture: "",
  },
  {
    id: 6,
    name: "Dr. Stephen Hawking",
    email: "stephen.hawking@example.com",
    phone: "+1 (555) 678-9012",
    department: "Physics",
    designation: "Professor",
    joinDate: "2016-11-10",
    status: "Active",
    courses: ["PHY301", "PHY401"],
    profilePicture: "",
  },
]

export default function FacultyManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [facultyData, setFacultyData] = useState(initialFacultyData)
  const [isAddFacultyDialogOpen, setIsAddFacultyDialogOpen] = useState(false)
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Computer Science",
    designation: "Assistant Professor",
    joinDate: new Date().toISOString().split("T")[0],
    status: "Active",
    courses: [],
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

  // Filter faculty based on search term, selected department, and selected status
  const filteredFaculty = facultyData.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || faculty.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || faculty.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Get unique departments and statuses for filters
  const uniqueDepartments = Array.from(new Set(facultyData.map((faculty) => faculty.department)))
  const uniqueStatuses = Array.from(new Set(facultyData.map((faculty) => faculty.status)))

  const handleAddFaculty = () => {
    // Validate form
    if (
      !newFaculty.name ||
      !newFaculty.email ||
      !newFaculty.phone ||
      !newFaculty.department ||
      !newFaculty.designation
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new faculty
    const newId = Math.max(...facultyData.map((faculty) => faculty.id)) + 1
    const facultyToAdd = {
      ...newFaculty,
      id: newId,
      profilePicture: "",
      courses: [],
    }

    setFacultyData([...facultyData, facultyToAdd])
    setIsAddFacultyDialogOpen(false)

    // Reset form
    setNewFaculty({
      name: "",
      email: "",
      phone: "",
      department: "Computer Science",
      designation: "Assistant Professor",
      joinDate: new Date().toISOString().split("T")[0],
      status: "Active",
      courses: [],
    })

    toast({
      title: "Faculty added",
      description: `${newFaculty.name} has been added successfully.`,
    })
  }

  const handleDeleteFaculty = (id: number) => {
    setFacultyData(facultyData.filter((faculty) => faculty.id !== id))

    toast({
      title: "Faculty deleted",
      description: "The faculty member has been deleted successfully.",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
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
          <h2 className="text-2xl font-bold">Faculty Management</h2>
          <p className="text-muted-foreground">Manage faculty members and their information</p>
        </div>
        <Button className="gap-1" onClick={() => setIsAddFacultyDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add Faculty</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultyData.length}</div>
            <p className="text-xs text-muted-foreground">Faculty members</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Faculty</CardTitle>
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facultyData.filter((faculty) => faculty.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
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
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facultyData.filter((faculty) => faculty.status === "On Leave").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently on leave</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-background">
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>View and manage all faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search faculty..."
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFaculty.length === 0 ? (
              <div className="col-span-full text-center py-4">
                No faculty members found matching your search criteria
              </div>
            ) : (
              filteredFaculty.map((faculty) => (
                <Card key={faculty.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={faculty.profilePicture} />
                          <AvatarFallback>{getInitials(faculty.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{faculty.name}</CardTitle>
                          <CardDescription>{faculty.designation}</CardDescription>
                        </div>
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
                            <span>Edit Faculty</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFaculty(faculty.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Faculty</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{faculty.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{faculty.phone}</span>
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
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <span>{faculty.department}</span>
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
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                        <span>Joined {new Date(faculty.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            faculty.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          }`}
                        >
                          {faculty.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      View Courses
                    </Button>
                    <Button size="sm">View Profile</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Faculty Dialog */}
      <Dialog open={isAddFacultyDialogOpen} onOpenChange={setIsAddFacultyDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Faculty Member</DialogTitle>
            <DialogDescription>Enter the details for the new faculty member you want to add.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Dr. John Smith"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., john.smith@example.com"
                  value={newFaculty.email}
                  onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="e.g., +1 (555) 123-4567"
                  value={newFaculty.phone}
                  onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newFaculty.department}
                  onValueChange={(value) => setNewFaculty({ ...newFaculty, department: value })}
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
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={newFaculty.designation}
                  onValueChange={(value) => setNewFaculty({ ...newFaculty, designation: value })}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newFaculty.joinDate}
                  onChange={(e) => setNewFaculty({ ...newFaculty, joinDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newFaculty.status}
                  onValueChange={(value) => setNewFaculty({ ...newFaculty, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFacultyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFaculty}>Add Faculty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
