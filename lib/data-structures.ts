// This file contains the data structures and algorithms used in the NexaLink Academic System

// 1. Attendance Management
// Using Map for O(1) lookup of student attendance records
export class AttendanceManager {
  private studentAttendance: Map<string, Map<string, Map<string, string>>>
  // studentId -> courseId -> date -> status

  constructor() {
    this.studentAttendance = new Map()
  }

  // O(1) time complexity
  addRecord(studentId: string, courseId: string, date: string, status: string): void {
    if (!this.studentAttendance.has(studentId)) {
      this.studentAttendance.set(studentId, new Map())
    }

    const studentCourses = this.studentAttendance.get(studentId)!

    if (!studentCourses.has(courseId)) {
      studentCourses.set(courseId, new Map())
    }

    const courseDates = studentCourses.get(courseId)!
    courseDates.set(date, status)
  }

  // O(1) time complexity
  getRecord(studentId: string, courseId: string, date: string): string | undefined {
    if (!this.studentAttendance.has(studentId)) return undefined

    const studentCourses = this.studentAttendance.get(studentId)!
    if (!studentCourses.has(courseId)) return undefined

    const courseDates = studentCourses.get(courseId)!
    return courseDates.get(date)
  }

  // O(n) where n is the number of dates for a course
  getAttendancePercentage(studentId: string, courseId: string): number {
    if (!this.studentAttendance.has(studentId)) return 0

    const studentCourses = this.studentAttendance.get(studentId)!
    if (!studentCourses.has(courseId)) return 0

    const courseDates = studentCourses.get(courseId)!
    if (courseDates.size === 0) return 0

    let presentCount = 0

    for (const status of courseDates.values()) {
      if (status === "present" || status === "late") {
        presentCount++
      }
    }

    return (presentCount / courseDates.size) * 100
  }

  // O(n) where n is the number of dates in the range
  getRecordsByDateRange(studentId: string, courseId: string, startDate: string, endDate: string): Map<string, string> {
    const result = new Map<string, string>()

    if (!this.studentAttendance.has(studentId)) return result

    const studentCourses = this.studentAttendance.get(studentId)!
    if (!studentCourses.has(courseId)) return result

    const courseDates = studentCourses.get(courseId)!

    for (const [date, status] of courseDates.entries()) {
      if (date >= startDate && date <= endDate) {
        result.set(date, status)
      }
    }

    return result
  }
}

// 2. Syllabus Access
// Using Tree structure for hierarchical representation
export class SyllabusNode {
  id: string
  title: string
  description: string
  children: SyllabusNode[]
  content?: string
  resources?: string[]

  constructor(id: string, title: string, description: string) {
    this.id = id
    this.title = title
    this.description = description
    this.children = []
  }

  addChild(child: SyllabusNode): void {
    this.children.push(child)
  }
}

export class SyllabusTree {
  root: SyllabusNode
  nodeIndex: Map<string, SyllabusNode>

  constructor(courseId: string, title: string) {
    this.root = new SyllabusNode(courseId, title, "")
    this.nodeIndex = new Map()
    this.nodeIndex.set(courseId, this.root)
  }

  // O(1) time complexity with the index
  getNode(id: string): SyllabusNode | undefined {
    return this.nodeIndex.get(id)
  }

  // O(1) time complexity
  addNode(parentId: string, node: SyllabusNode): boolean {
    const parent = this.nodeIndex.get(parentId)
    if (!parent) return false

    parent.addChild(node)
    this.nodeIndex.set(node.id, node)
    return true
  }

  // Depth-First Search traversal - O(n) where n is the number of nodes
  dfsTraversal(callback: (node: SyllabusNode, depth: number) => void): void {
    const traverse = (node: SyllabusNode, depth: number) => {
      callback(node, depth)
      for (const child of node.children) {
        traverse(child, depth + 1)
      }
    }

    traverse(this.root, 0)
  }

  // Breadth-First Search traversal - O(n) where n is the number of nodes
  bfsTraversal(callback: (node: SyllabusNode, depth: number) => void): void {
    const queue: [SyllabusNode, number][] = [[this.root, 0]]

    while (queue.length > 0) {
      const [node, depth] = queue.shift()!
      callback(node, depth)

      for (const child of node.children) {
        queue.push([child, depth + 1])
      }
    }
  }

  // Keyword search using DFS - O(n) where n is the number of nodes
  search(keyword: string): SyllabusNode[] {
    const normalizedKeyword = keyword.toLowerCase()
    const results: SyllabusNode[] = []

    this.dfsTraversal((node, _) => {
      if (
        node.title.toLowerCase().includes(normalizedKeyword) ||
        node.description.toLowerCase().includes(normalizedKeyword) ||
        (node.content && node.content.toLowerCase().includes(normalizedKeyword))
      ) {
        results.push(node)
      }
    })

    return results
  }
}

// 3. Performance Tracking
// Using time-series data structure
export class PerformanceTracker {
  private studentScores: Map<
    string,
    Map<
      string,
      {
        scores: Array<{ value: number; maxValue: number; weight: number; timestamp: number; type: string }>
        average: number
      }
    >
  >
  // studentId -> courseId -> { scores, average }

  constructor() {
    this.studentScores = new Map()
  }

  // O(1) time complexity
  addScore(studentId: string, courseId: string, value: number, maxValue: number, weight: number, type: string): void {
    if (!this.studentScores.has(studentId)) {
      this.studentScores.set(studentId, new Map())
    }

    const studentCourses = this.studentScores.get(studentId)!

    if (!studentCourses.has(courseId)) {
      studentCourses.set(courseId, {
        scores: [],
        average: 0,
      })
    }

    const courseData = studentCourses.get(courseId)!

    courseData.scores.push({
      value,
      maxValue,
      weight,
      timestamp: Date.now(),
      type,
    })

    // Recalculate weighted average
    this.recalculateAverage(studentId, courseId)
  }

  // O(n) where n is the number of scores
  private recalculateAverage(studentId: string, courseId: string): void {
    const studentCourses = this.studentScores.get(studentId)!
    const courseData = studentCourses.get(courseId)!

    if (courseData.scores.length === 0) {
      courseData.average = 0
      return
    }

    let totalWeight = 0
    let weightedSum = 0

    for (const score of courseData.scores) {
      totalWeight += score.weight
      weightedSum += (score.value / score.maxValue) * score.weight
    }

    if (totalWeight === 0) {
      courseData.average = 0
    } else {
      courseData.average = (weightedSum / totalWeight) * 100
    }
  }

  // O(1) time complexity
  getAverage(studentId: string, courseId: string): number {
    if (!this.studentScores.has(studentId)) return 0

    const studentCourses = this.studentScores.get(studentId)!
    if (!studentCourses.has(courseId)) return 0

    return studentCourses.get(courseId)!.average
  }

  // O(n) where n is the number of scores
  getScoresByType(
    studentId: string,
    courseId: string,
    type: string,
  ): Array<{ value: number; maxValue: number; weight: number; timestamp: number; type: string }> {
    if (!this.studentScores.has(studentId)) return []

    const studentCourses = this.studentScores.get(studentId)!
    if (!studentCourses.has(courseId)) return []

    const courseData = studentCourses.get(courseId)!
    return courseData.scores.filter((score) => score.type === type)
  }

  // Linear regression for trend prediction - O(n) where n is the number of scores
  predictTrend(studentId: string, courseId: string): number | null {
    if (!this.studentScores.has(studentId)) return null

    const studentCourses = this.studentScores.get(studentId)!
    if (!studentCourses.has(courseId)) return null

    const courseData = studentCourses.get(courseId)!
    if (courseData.scores.length < 3) return null

    // Sort by timestamp
    const sortedScores = [...courseData.scores].sort((a, b) => a.timestamp - b.timestamp)

    // Extract x (time) and y (normalized scores)
    const x: number[] = sortedScores.map((score) => score.timestamp)
    const y: number[] = sortedScores.map((score) => score.value / score.maxValue)

    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length

    // Calculate slope and intercept for linear regression
    let numerator = 0
    let denominator = 0

    for (let i = 0; i < x.length; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY)
      denominator += (x[i] - meanX) ** 2
    }

    if (denominator === 0) return meanY * 100

    const slope = numerator / denominator
    const intercept = meanY - slope * meanX

    // Predict for next time period
    const nextTime =
      sortedScores[sortedScores.length - 1].timestamp +
      (sortedScores[sortedScores.length - 1].timestamp - sortedScores[0].timestamp) / sortedScores.length

    const prediction = slope * nextTime + intercept

    // Clamp between 0 and 1, then convert to percentage
    return Math.max(0, Math.min(1, prediction)) * 100
  }
}

// 4. Feedback System
// Using graph structure for threaded feedback
export class FeedbackNode {
  id: string
  content: string
  authorId: string
  authorType: "student" | "faculty" | "admin"
  timestamp: number
  replies: FeedbackNode[]
  sentiment?: "positive" | "neutral" | "negative"

  constructor(id: string, content: string, authorId: string, authorType: "student" | "faculty" | "admin") {
    this.id = id
    this.content = content
    this.authorId = authorId
    this.authorType = authorType
    this.timestamp = Date.now()
    this.replies = []
  }

  addReply(reply: FeedbackNode): void {
    this.replies.push(reply)
  }
}

export class FeedbackGraph {
  feedbacks: Map<string, FeedbackNode>
  feedbacksByStudent: Map<string, Set<string>>
  feedbacksByCourse: Map<string, Set<string>>
  feedbacksByFaculty: Map<string, Set<string>>

  constructor() {
    this.feedbacks = new Map()
    this.feedbacksByStudent = new Map()
    this.feedbacksByCourse = new Map()
    this.feedbacksByFaculty = new Map()
  }

  // O(1) time complexity
  addFeedback(
    id: string,
    content: string,
    studentId: string,
    courseId: string,
    facultyId: string,
    sentiment?: "positive" | "neutral" | "negative",
  ): FeedbackNode {
    const feedback = new FeedbackNode(id, content, studentId, "student")
    feedback.sentiment = sentiment

    this.feedbacks.set(id, feedback)

    // Add to indexes
    if (!this.feedbacksByStudent.has(studentId)) {
      this.feedbacksByStudent.set(studentId, new Set())
    }
    this.feedbacksByStudent.get(studentId)!.add(id)

    if (!this.feedbacksByCourse.has(courseId)) {
      this.feedbacksByCourse.set(courseId, new Set())
    }
    this.feedbacksByCourse.get(courseId)!.add(id)

    if (!this.feedbacksByFaculty.has(facultyId)) {
      this.feedbacksByFaculty.set(facultyId, new Set())
    }
    this.feedbacksByFaculty.get(facultyId)!.add(id)

    return feedback
  }

  // O(1) time complexity
  addReply(
    feedbackId: string,
    replyId: string,
    content: string,
    authorId: string,
    authorType: "student" | "faculty" | "admin",
    sentiment?: "positive" | "neutral" | "negative",
  ): FeedbackNode | null {
    const feedback = this.feedbacks.get(feedbackId)
    if (!feedback) return null

    const reply = new FeedbackNode(replyId, content, authorId, authorType)
    reply.sentiment = sentiment

    feedback.addReply(reply)
    this.feedbacks.set(replyId, reply)

    return reply
  }

  // O(1) time complexity
  getFeedback(id: string): FeedbackNode | undefined {
    return this.feedbacks.get(id)
  }

  // O(n) where n is the number of feedbacks for the student
  getFeedbacksByStudent(studentId: string): FeedbackNode[] {
    if (!this.feedbacksByStudent.has(studentId)) return []

    const feedbackIds = this.feedbacksByStudent.get(studentId)!
    return Array.from(feedbackIds).map((id) => this.feedbacks.get(id)!)
  }

  // O(n) where n is the number of feedbacks for the course
  getFeedbacksByCourse(courseId: string): FeedbackNode[] {
    if (!this.feedbacksByCourse.has(courseId)) return []

    const feedbackIds = this.feedbacksByCourse.get(courseId)!
    return Array.from(feedbackIds).map((id) => this.feedbacks.get(id)!)
  }

  // O(n) where n is the number of feedbacks for the faculty
  getFeedbacksByFaculty(facultyId: string): FeedbackNode[] {
    if (!this.feedbacksByFaculty.has(facultyId)) return []

    const feedbackIds = this.feedbacksByFaculty.get(facultyId)!
    return Array.from(feedbackIds).map((id) => this.feedbacks.get(id)!)
  }

  // O(n) where n is the number of feedbacks
  searchFeedbacks(keyword: string): FeedbackNode[] {
    const normalizedKeyword = keyword.toLowerCase()
    const results: FeedbackNode[] = []

    for (const feedback of this.feedbacks.values()) {
      if (feedback.content.toLowerCase().includes(normalizedKeyword)) {
        results.push(feedback)
      }
    }

    return results
  }
}

// 5. Analytics Dashboard
// Using aggregation and statistical functions
export class AnalyticsDashboard {
  private attendanceData: Map<string, Map<string, number[]>>
  // courseId -> studentId -> [attendance percentages]

  private performanceData: Map<string, Map<string, number[]>>
  // courseId -> studentId -> [scores]

  private engagementData: Map<string, number>
  // userId -> engagement count

  constructor() {
    this.attendanceData = new Map()
    this.performanceData = new Map()
    this.engagementData = new Map()
  }

  // O(1) time complexity
  addAttendanceRecord(courseId: string, studentId: string, percentage: number): void {
    if (!this.attendanceData.has(courseId)) {
      this.attendanceData.set(courseId, new Map())
    }

    const courseStudents = this.attendanceData.get(courseId)!

    if (!courseStudents.has(studentId)) {
      courseStudents.set(studentId, [])
    }

    courseStudents.get(studentId)!.push(percentage)
  }

  // O(1) time complexity
  addPerformanceRecord(courseId: string, studentId: string, score: number): void {
    if (!this.performanceData.has(courseId)) {
      this.performanceData.set(courseId, new Map())
    }

    const courseStudents = this.performanceData.get(courseId)!

    if (!courseStudents.has(studentId)) {
      courseStudents.set(studentId, [])
    }

    courseStudents.get(studentId)!.push(score)
  }

  // O(1) time complexity
  addEngagementRecord(userId: string): void {
    this.engagementData.set(userId, (this.engagementData.get(userId) || 0) + 1)
  }

  // O(n) where n is the number of students in the course
  getAverageAttendance(courseId: string): number {
    if (!this.attendanceData.has(courseId)) return 0

    const courseStudents = this.attendanceData.get(courseId)!
    if (courseStudents.size === 0) return 0

    let totalPercentage = 0
    let count = 0

    for (const percentages of courseStudents.values()) {
      if (percentages.length === 0) continue

      const studentAvg = percentages.reduce((sum, val) => sum + val, 0) / percentages.length
      totalPercentage += studentAvg
      count++
    }

    return count === 0 ? 0 : totalPercentage / count
  }

  // O(n) where n is the number of students in the course
  getAveragePerformance(courseId: string): number {
    if (!this.performanceData.has(courseId)) return 0

    const courseStudents = this.performanceData.get(courseId)!
    if (courseStudents.size === 0) return 0

    let totalScore = 0
    let count = 0

    for (const scores of courseStudents.values()) {
      if (scores.length === 0) continue

      const studentAvg = scores.reduce((sum, val) => sum + val, 0) / scores.length
      totalScore += studentAvg
      count++
    }

    return count === 0 ? 0 : totalScore / count
  }

  // O(n log n) where n is the number of students in the course
  getTopPerformers(courseId: string, limit = 5): Array<{ studentId: string; average: number }> {
    if (!this.performanceData.has(courseId)) return []

    const courseStudents = this.performanceData.get(courseId)!
    if (courseStudents.size === 0) return []

    const studentAverages: Array<{ studentId: string; average: number }> = []

    for (const [studentId, scores] of courseStudents.entries()) {
      if (scores.length === 0) continue

      const average = scores.reduce((sum, val) => sum + val, 0) / scores.length
      studentAverages.push({ studentId, average })
    }

    // Sort by average (descending) and take top performers
    return studentAverages.sort((a, b) => b.average - a.average).slice(0, limit)
  }

  // O(n log n) where n is the number of users
  getMostEngagedUsers(limit = 5): Array<{ userId: string; count: number }> {
    const userEngagement: Array<{ userId: string; count: number }> = []

    for (const [userId, count] of this.engagementData.entries()) {
      userEngagement.push({ userId, count })
    }

    // Sort by count (descending) and take top users
    return userEngagement.sort((a, b) => b.count - a.count).slice(0, limit)
  }

  // Statistical functions

  // O(n) where n is the number of values
  calculateMean(values: number[]): number {
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  // O(n log n) where n is the number of values
  calculateMedian(values: number[]): number {
    if (values.length === 0) return 0

    const sorted = [...values].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2
    } else {
      return sorted[middle]
    }
  }

  // O(n) where n is the number of values
  calculateMode(values: number[]): number[] {
    if (values.length === 0) return []

    const counts = new Map<number, number>()
    let maxCount = 0

    for (const val of values) {
      const count = (counts.get(val) || 0) + 1
      counts.set(val, count)
      maxCount = Math.max(maxCount, count)
    }

    const modes: number[] = []
    for (const [val, count] of counts.entries()) {
      if (count === maxCount) {
        modes.push(val)
      }
    }

    return modes
  }

  // O(n) where n is the number of values
  calculateStandardDeviation(values: number[]): number {
    if (values.length <= 1) return 0

    const mean = this.calculateMean(values)
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2))
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1)

    return Math.sqrt(variance)
  }
}

// 6. Study Materials Repository
// Using Trie for fast keyword search
export class TrieNode {
  children: Map<string, TrieNode>
  isEndOfWord: boolean
  materialIds: Set<string>

  constructor() {
    this.children = new Map()
    this.isEndOfWord = false
    this.materialIds = new Set()
  }
}

export class MaterialsTrie {
  root: TrieNode

  constructor() {
    this.root = new TrieNode()
  }

  // O(m) where m is the length of the word
  insert(word: string, materialId: string): void {
    let current = this.root

    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode())
      }
      current = current.children.get(char)!
    }

    current.isEndOfWord = true
    current.materialIds.add(materialId)
  }

  // O(m) where m is the length of the word
  search(word: string): Set<string> {
    let current = this.root

    for (const char of word) {
      if (!current.children.has(char)) {
        return new Set()
      }
      current = current.children.get(char)!
    }

    return current.isEndOfWord ? current.materialIds : new Set()
  }

  // O(m) where m is the length of the prefix
  startsWith(prefix: string): Set<string> {
    let current = this.root

    for (const char of prefix) {
      if (!current.children.has(char)) {
        return new Set()
      }
      current = current.children.get(char)!
    }

    // Collect all material IDs in the subtree
    return this.collectMaterialIds(current)
  }

  // O(n) where n is the number of nodes in the subtree
  private collectMaterialIds(node: TrieNode): Set<string> {
    const result = new Set<string>([...node.materialIds])

    for (const child of node.children.values()) {
      const childIds = this.collectMaterialIds(child)
      for (const id of childIds) {
        result.add(id)
      }
    }

    return result
  }
}

// 7. IA Marks Management
// Using 2D matrix for efficient storage and retrieval
export class IAMarksManager {
  private marksMatrix: Map<string, Map<string, Map<number, number>>>
  // courseId -> studentId -> iaNumber -> marks

  constructor() {
    this.marksMatrix = new Map()
  }

  // O(1) time complexity
  addMarks(courseId: string, studentId: string, iaNumber: number, marks: number): void {
    if (!this.marksMatrix.has(courseId)) {
      this.marksMatrix.set(courseId, new Map())
    }

    const courseStudents = this.marksMatrix.get(courseId)!

    if (!courseStudents.has(studentId)) {
      courseStudents.set(studentId, new Map())
    }

    const studentIAs = courseStudents.get(studentId)!
    studentIAs.set(iaNumber, marks)
  }

  // O(1) time complexity
  getMarks(courseId: string, studentId: string, iaNumber: number): number | undefined {
    if (!this.marksMatrix.has(courseId)) return undefined

    const courseStudents = this.marksMatrix.get(courseId)!
    if (!courseStudents.has(studentId)) return undefined

    const studentIAs = courseStudents.get(studentId)!
    return studentIAs.get(iaNumber)
  }

  // O(n) where n is the number of IAs
  getTotalMarks(courseId: string, studentId: string): number {
    if (!this.marksMatrix.has(courseId)) return 0

    const courseStudents = this.marksMatrix.get(courseId)!
    if (!courseStudents.has(studentId)) return 0

    const studentIAs = courseStudents.get(studentId)!
    let total = 0

    for (const marks of studentIAs.values()) {
      total += marks
    }

    return total
  }

  // O(n) where n is the number of students
  getAverageMarks(courseId: string, iaNumber: number): number {
    if (!this.marksMatrix.has(courseId)) return 0

    const courseStudents = this.marksMatrix.get(courseId)!
    if (courseStudents.size === 0) return 0

    let total = 0
    let count = 0

    for (const studentIAs of courseStudents.values()) {
      const marks = studentIAs.get(iaNumber)
      if (marks !== undefined) {
        total += marks
        count++
      }
    }

    return count === 0 ? 0 : total / count
  }

  // O(n log n) where n is the number of students
  getTopPerformers(courseId: string, iaNumber: number, limit = 5): Array<{ studentId: string; marks: number }> {
    if (!this.marksMatrix.has(courseId)) return []

    const courseStudents = this.marksMatrix.get(courseId)!
    if (courseStudents.size === 0) return []

    const studentMarks: Array<{ studentId: string; marks: number }> = []

    for (const [studentId, studentIAs] of courseStudents.entries()) {
      const marks = studentIAs.get(iaNumber)
      if (marks !== undefined) {
        studentMarks.push({ studentId, marks })
      }
    }

    // Sort by marks (descending) and take top performers
    return studentMarks.sort((a, b) => b.marks - a.marks).slice(0, limit)
  }

  // O(1) time complexity
  calculateGrade(marks: number, maxMarks: number): string {
    const percentage = (marks / maxMarks) * 100

    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    if (percentage >= 40) return "D"
    return "F"
  }
}
