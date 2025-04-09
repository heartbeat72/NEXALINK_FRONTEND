// This file contains the database schema design for the NexaLink Academic System

// User-related schemas
interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  role: "student" | "faculty" | "admin"
  firstName: string
  lastName: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

interface Student extends User {
  role: "student"
  enrollmentNumber: string
  batch: string
  department: string
  semester: number
  courses: string[] // Array of course IDs
  cgpa: number
  attendance: Map<string, number> // Course ID to attendance percentage
}

interface Faculty extends User {
  role: "faculty"
  employeeId: string
  department: string
  designation: string
  specialization: string[]
  courses: string[] // Array of course IDs they teach
}

interface Admin extends User {
  role: "admin"
  employeeId: string
  department: string
  permissions: string[] // Array of permission codes
}

// Course-related schemas
interface Course {
  id: string
  code: string
  title: string
  description: string
  department: string
  semester: number
  credits: number
  facultyId: string
  students: string[] // Array of student IDs
  syllabus: string // Reference to syllabus document
  materials: string[] // Array of material IDs
  createdAt: Date
  updatedAt: Date
}

interface Syllabus {
  id: string
  courseId: string
  modules: Module[]
  createdAt: Date
  updatedAt: Date
}

interface Module {
  id: string
  title: string
  description: string
  topics: Topic[]
  order: number
}

interface Topic {
  id: string
  title: string
  description: string
  content: string
  resources: string[] // Array of resource URLs
  order: number
}

// Material-related schemas
interface Material {
  id: string
  courseId: string
  moduleId: string
  topicId: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  uploadedBy: string // Faculty ID
  uploadedAt: Date
  version: number
  previousVersions: string[] // Array of previous version IDs
  keywords: string[]
}

// Attendance-related schemas
interface AttendanceRecord {
  id: string
  studentId: string
  courseId: string
  date: Date
  status: "present" | "absent" | "late"
  markedBy: string // Faculty ID
  markedAt: Date
  remarks?: string
}

// Performance-related schemas
interface IAMark {
  id: string
  studentId: string
  courseId: string
  iaNumber: number
  marks: number
  maxMarks: number
  date: Date
  facultyId: string
  remarks?: string
}

interface Performance {
  id: string
  studentId: string
  courseId: string
  scores: Score[]
  createdAt: Date
  updatedAt: Date
}

interface Score {
  id: string
  type: "quiz" | "assignment" | "exam" | "project"
  title: string
  value: number
  maxValue: number
  weight: number
  date: Date
  remarks?: string
}

// Feedback-related schemas
interface Feedback {
  id: string
  studentId: string
  courseId: string
  facultyId: string
  content: string
  rating: number
  timestamp: Date
  status: "pending" | "responded" | "resolved"
  replies: FeedbackReply[]
  sentiment?: "positive" | "neutral" | "negative"
  keywords: string[]
}

interface FeedbackReply {
  id: string
  feedbackId: string
  content: string
  authorId: string
  authorType: "student" | "faculty" | "admin"
  timestamp: Date
  sentiment?: "positive" | "neutral" | "negative"
}

// Analytics-related schemas
interface EngagementRecord {
  id: string
  userId: string
  userType: "student" | "faculty" | "admin"
  action: string
  resource: string
  timestamp: Date
  metadata: Record<string, any>
}

// Notification-related schemas
interface Notification {
  id: string
  userId: string
  title: string
  content: string
  type: "announcement" | "reminder" | "feedback" | "grade" | "system"
  read: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
}

// Indexes and Relationships
/*
Key Indexes:
1. User: id, email, role
2. Student: id, enrollmentNumber, department, semester
3. Faculty: id, employeeId, department
4. Course: id, code, department, semester, facultyId
5. Material: id, courseId, keywords
6. AttendanceRecord: studentId, courseId, date
7. IAMark: studentId, courseId, iaNumber
8. Feedback: id, studentId, courseId, facultyId, status
9. EngagementRecord: userId, timestamp

Relationships:
1. Student -> Courses (Many-to-Many)
2. Faculty -> Courses (One-to-Many)
3. Course -> Syllabus (One-to-One)
4. Course -> Materials (One-to-Many)
5. Student -> AttendanceRecords (One-to-Many)
6. Student -> IAMarks (One-to-Many)
7. Student -> Performance (One-to-Many)
8. Student -> Feedback (One-to-Many)
9. User -> Notifications (One-to-Many)
*/

export type {
  User,
  Student,
  Faculty,
  Admin,
  Course,
  Syllabus,
  Module,
  Topic,
  Material,
  AttendanceRecord,
  IAMark,
  Performance,
  Score,
  Feedback,
  FeedbackReply,
  EngagementRecord,
  Notification,
}
