"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MessageSquare, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import { StarRating } from "@/components/feedback-star-rating"

// Mock data for student feedback
const initialFeedbackData = [
  {
    id: 1,
    studentName: "John Smith",
    studentId: "S001",
    course: "Introduction to Computer Science",
    courseCode: "CS101",
    subject: "Lecture Pace Feedback",
    message:
      "The pace of lectures is a bit fast. Could you please slow down a bit and explain concepts in more detail?",
    response: "",
    status: "Pending",
    date: "2025-03-01",
    rating: 4,
  },
  {
    id: 2,
    studentName: "Emily Johnson",
    studentId: "S002",
    course: "Data Structures & Algorithms",
    courseCode: "DS201",
    subject: "Assignment Difficulty",
    message:
      "The recent assignment on graph algorithms was quite challenging. Could we have more practice problems before such assignments?",
    response: "",
    status: "Pending",
    date: "2025-03-05",
    rating: 3,
  },
  {
    id: 3,
    studentName: "Michael Brown",
    studentId: "S003",
    course: "Artificial Intelligence",
    courseCode: "AI301",
    subject: "Course Material Suggestion",
    message:
      "Could you provide additional resources for neural networks? The current materials are good but I'd like to explore more.",
    response:
      "I've added additional resources on neural networks to the course materials section. Please check and let me know if you need more specific resources.",
    status: "Responded",
    date: "2025-02-20",
    rating: 5,
  },
  {
    id: 4,
    studentName: "Sarah Davis",
    studentId: "S004",
    course: "Introduction to Computer Science",
    courseCode: "CS101",
    subject: "Clarification on Assignment",
    message:
      "I'm having trouble understanding the requirements for the final project. Could you provide more details or examples?",
    response: "",
    status: "Pending",
    date: "2025-03-02",
    rating: 4,
  },
]

export default function StudentFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [feedbackData, setFeedbackData] = useState(initialFeedbackData)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const [responseText, setResponseText] = useState("")
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Filter feedback based on search term, selected course, and selected status
  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesSearch =
      feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || feedback.courseCode === selectedCourse
    const matchesStatus = selectedStatus === "all" || feedback.status === selectedStatus

    return matchesSearch && matchesCourse && matchesStatus
  })

  // Get unique courses for filter
  const uniqueCourses = Array.from(new Set(feedbackData.map((feedback) => feedback.courseCode)))

  const handleOpenResponseDialog = (feedback: any) => {
    setSelectedFeedback(feedback)
    setResponseText(feedback.response || "")
    setIsResponseDialogOpen(true)
  }

  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive",
      })
      return
    }

    // Update feedback with response
    const updatedFeedback = feedbackData.map((feedback) => {
      if (feedback.id === selectedFeedback.id) {
        return {
          ...feedback,
          response: responseText,
          status: "Responded",
        }
      }
      return feedback
    })

    setFeedbackData(updatedFeedback)
    setIsResponseDialogOpen(false)

    toast({
      title: "Response submitted",
      description: "Your response has been submitted successfully.",
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
          <h2 className="text-2xl font-bold">Student Feedback</h2>
          <p className="text-muted-foreground">View and respond to student feedback for your courses</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData.length}</div>
            <p className="text-xs text-muted-foreground">Feedback received</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData.filter((feedback) => feedback.status === "Responded").length}
            </div>
            <p className="text-xs text-muted-foreground">Feedback responded to</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <X className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData.filter((feedback) => feedback.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
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
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackData.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Student Feedback</CardTitle>
              <CardDescription>View and respond to all student feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
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
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Responded">Responded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredFeedback.length === 0 ? (
                  <div className="text-center py-4">No feedback found matching your search criteria</div>
                ) : (
                  filteredFeedback.map((feedback) => (
                    <Card key={feedback.id} className="overflow-hidden">
                      <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <CardTitle className="text-base">{feedback.subject}</CardTitle>
                            <CardDescription>
                              {feedback.studentName} ({feedback.studentId}) - {feedback.course} ({feedback.courseCode})
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">{feedback.date}</div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${
                                feedback.status === "Responded"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                              }`}
                            >
                              {feedback.status}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Rating:</span>
                            <StarRating value={feedback.rating} onChange={() => {}} readOnly={true} size="sm" />
                          </div>
                          <div className="text-sm mb-4">{feedback.message}</div>

                          {feedback.response && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                              <div className="text-sm font-medium mb-1">Your Response:</div>
                              <div className="text-sm">{feedback.response}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            variant={feedback.status === "Responded" ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleOpenResponseDialog(feedback)}
                          >
                            {feedback.status === "Responded" ? "Edit Response" : "Respond"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Feedback</CardTitle>
              <CardDescription>Feedback awaiting your response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFeedback.filter((f) => f.status === "Pending").length === 0 ? (
                  <div className="text-center py-4">No pending feedback found</div>
                ) : (
                  filteredFeedback
                    .filter((f) => f.status === "Pending")
                    .map((feedback) => (
                      <Card key={feedback.id} className="overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <CardTitle className="text-base">{feedback.subject}</CardTitle>
                              <CardDescription>
                                {feedback.studentName} ({feedback.studentId}) - {feedback.course} ({feedback.courseCode}
                                )
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground">{feedback.date}</div>
                              <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
                                Pending
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="mb-2">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-sm font-medium">Rating:</span>
                              <StarRating value={feedback.rating} onChange={() => {}} readOnly={true} size="sm" />
                            </div>
                            <div className="text-sm">{feedback.message}</div>
                          </div>

                          <div className="flex justify-end">
                            <Button size="sm" onClick={() => handleOpenResponseDialog(feedback)}>
                              Respond
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Responded Feedback</CardTitle>
              <CardDescription>Feedback you have already responded to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFeedback.filter((f) => f.status === "Responded").length === 0 ? (
                  <div className="text-center py-4">No responded feedback found</div>
                ) : (
                  filteredFeedback
                    .filter((f) => f.status === "Responded")
                    .map((feedback) => (
                      <Card key={feedback.id} className="overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <CardTitle className="text-base">{feedback.subject}</CardTitle>
                              <CardDescription>
                                {feedback.studentName} ({feedback.studentId}) - {feedback.course} ({feedback.courseCode}
                                )
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground">{feedback.date}</div>
                              <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                                Responded
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="mb-2">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-sm font-medium">Rating:</span>
                              <StarRating value={feedback.rating} onChange={() => {}} readOnly={true} size="sm" />
                            </div>
                            <div className="text-sm mb-4">{feedback.message}</div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                              <div className="text-sm font-medium mb-1">Your Response:</div>
                              <div className="text-sm">{feedback.response}</div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleOpenResponseDialog(feedback)}>
                              Edit Response
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFeedback?.status === "Responded" ? "Edit Response" : "Respond to Feedback"}
            </DialogTitle>
            <DialogDescription>
              {selectedFeedback?.status === "Responded"
                ? "Update your response to this student's feedback"
                : "Provide a response to this student's feedback"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-subject" className="text-sm font-medium">
                Subject
              </Label>
              <div id="feedback-subject" className="text-sm">
                {selectedFeedback?.subject}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message" className="text-sm font-medium">
                Student Message
              </Label>
              <div id="feedback-message" className="text-sm p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                {selectedFeedback?.message}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response" className="text-sm font-medium">
                Your Response
              </Label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitResponse}>
              {selectedFeedback?.status === "Responded" ? "Update Response" : "Submit Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
