"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, MessageSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { StarRating } from "@/components/feedback-star-rating"

// Mock data for courses and teachers
const coursesData = [
  { id: "cs101", name: "Introduction to Computer Science", teacher: "Dr. Sarah Johnson" },
  { id: "ds201", name: "Data Structures & Algorithms", teacher: "Prof. Michael Chen" },
  { id: "ai301", name: "Artificial Intelligence", teacher: "Dr. Robert Williams" },
  { id: "db201", name: "Database Systems", teacher: "Prof. Emily Rodriguez" },
  { id: "web101", name: "Web Development", teacher: "Dr. David Kim" },
]

// Feedback questions
const feedbackQuestions = [
  "Has the teacher covered the complete syllabus?",
  "Is the teaching methodology effective?",
  "Are the concepts explained clearly?",
  "Is the pace of teaching appropriate?",
  "Are the study materials provided helpful?",
  "Does the teacher encourage questions and discussions?",
  "Is the teacher punctual and regular?",
  "Are the assignments and assessments relevant?",
  "Does the teacher provide constructive feedback?",
  "Overall, how would you rate the course and teaching?",
]

// Mock data for feedback history
const feedbackHistory = [
  {
    id: 1,
    course: "Introduction to Computer Science",
    teacher: "Dr. Sarah Johnson",
    message:
      "The pace of lectures is a bit fast. Could you please slow down a bit and explain concepts in more detail?",
    response: "Thank you for your feedback. I'll adjust the pace of lectures to ensure better understanding.",
    status: "Responded",
    date: "2025-03-01",
    ratings: [4, 5, 3, 2, 4, 5, 4, 3, 4, 4],
  },
  {
    id: 2,
    course: "Data Structures & Algorithms",
    teacher: "Prof. Michael Chen",
    message:
      "The recent assignment on graph algorithms was quite challenging. Could we have more practice problems before such assignments?",
    response: "",
    status: "Pending",
    date: "2025-03-05",
    ratings: [3, 4, 3, 3, 2, 4, 5, 2, 3, 3],
  },
  {
    id: 3,
    course: "Artificial Intelligence",
    teacher: "Dr. Robert Williams",
    message:
      "Could you provide additional resources for neural networks? The current materials are good but I'd like to explore more.",
    response:
      "I've added additional resources on neural networks to the course materials section. Please check and let me know if you need more specific resources.",
    status: "Responded",
    date: "2025-02-20",
    ratings: [5, 5, 4, 5, 3, 5, 5, 4, 5, 5],
  },
]

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState("submit")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [teacherName, setTeacherName] = useState("")
  const [message, setMessage] = useState("")
  const [ratings, setRatings] = useState<number[]>(Array(feedbackQuestions.length).fill(0))
  const { toast } = useToast()

  // Update teacher name when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const course = coursesData.find((c) => c.id === selectedCourse)
      if (course) {
        setTeacherName(course.teacher)
      }
    } else {
      setTeacherName("")
    }
  }, [selectedCourse])

  const handleRatingChange = (index: number, value: number) => {
    const newRatings = [...ratings]
    newRatings[index] = value
    setRatings(newRatings)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive",
      })
      return
    }

    if (ratings.some((r) => r === 0)) {
      toast({
        title: "Error",
        description: "Please provide ratings for all questions",
        variant: "destructive",
      })
      return
    }

    // Submit feedback
    toast({
      title: "Feedback Submitted",
      description: "Your feedback has been submitted successfully",
    })

    // Reset form
    setSelectedCourse("")
    setTeacherName("")
    setMessage("")
    setRatings(Array(feedbackQuestions.length).fill(0))

    // Switch to history tab
    setActiveTab("history")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Feedback System</h2>
        <p className="text-muted-foreground">Submit and track your feedback for courses and instructors</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          <TabsTrigger value="history">Feedback History</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Feedback</CardTitle>
              <CardDescription>Share your thoughts about the course and instructor</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="course">Select Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesData.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {teacherName && (
                  <div className="space-y-2">
                    <Label>Instructor</Label>
                    <div className="p-2 bg-muted rounded-md">{teacherName}</div>
                  </div>
                )}

                {selectedCourse && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Please rate the following aspects:</h3>
                      <div className="space-y-6">
                        {feedbackQuestions.map((question, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
                            <Label className="text-sm">{question}</Label>
                            <StarRating
                              value={ratings[index]}
                              onChange={(value) => handleRatingChange(index, value)}
                              size="sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Comments (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Share any additional feedback or suggestions"
                        className="min-h-[100px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback History</CardTitle>
              <CardDescription>View your previous feedback submissions and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackHistory.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{feedback.course}</CardTitle>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            feedback.status === "Responded"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {feedback.status}
                        </span>
                      </div>
                      <CardDescription>
                        {feedback.teacher} • {new Date(feedback.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-4">Your Ratings:</h3>
                          <div className="space-y-3">
                            {feedbackQuestions.map((question, index) => (
                              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
                                <span className="text-sm text-muted-foreground">{question}</span>
                                <StarRating value={feedback.ratings[index]} onChange={() => {}} readOnly size="sm" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {feedback.message && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm">{feedback.message}</p>
                            </div>
                          </div>
                        )}

                        {feedback.response && (
                          <div className="flex items-start gap-2 pl-6 border-l-2 border-muted ml-2">
                            <Check className="h-4 w-4 mt-0.5 text-green-500" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">{feedback.response}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {feedback.status === "Pending" ? (
                        <p className="text-xs text-muted-foreground">Waiting for response</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Response received</p>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
