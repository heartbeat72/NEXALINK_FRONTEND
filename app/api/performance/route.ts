import { type NextRequest, NextResponse } from "next/server"

// Type definitions
type ScoreEntry = {
  id: string
  value: number
  maxValue: number
  weight: number
  timestamp: number
  type: "quiz" | "assignment" | "exam" | "project"
}

type StudentPerformance = {
  studentId: string
  courseId: string
  scores: ScoreEntry[]
}

// In-memory store (replace with database in production)
const performanceData: Map<string, Map<string, StudentPerformance>> = new Map()

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15)

// Calculate weighted average
function calculateWeightedAverage(scores: ScoreEntry[]): number {
  if (scores.length === 0) return 0

  const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = scores.reduce((sum, score) => {
    const percentage = score.value / score.maxValue
    return sum + percentage * score.weight
  }, 0)

  return (weightedSum / totalWeight) * 100
}

// Predict future performance using linear regression
function predictFuturePerformance(scores: ScoreEntry[]): number | null {
  if (scores.length < 3) return null

  // Sort by timestamp
  const sortedScores = [...scores].sort((a, b) => a.timestamp - b.timestamp)

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const courseId = searchParams.get("courseId")
  const predict = searchParams.get("predict") === "true"

  if (!studentId) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
  }

  // Get student's performance data
  const studentData = performanceData.get(studentId)
  if (!studentData) {
    return NextResponse.json({ performance: [] })
  }

  if (courseId) {
    // Get performance for specific course
    const coursePerformance = studentData.get(courseId)
    if (!coursePerformance) {
      return NextResponse.json({ error: "No performance data found for this course" }, { status: 404 })
    }

    const average = calculateWeightedAverage(coursePerformance.scores)
    let prediction = null

    if (predict) {
      prediction = predictFuturePerformance(coursePerformance.scores)
    }

    return NextResponse.json({
      performance: coursePerformance,
      average,
      prediction,
    })
  }

  // Get performance for all courses
  const allPerformance = Array.from(studentData.values())
  const courseAverages = allPerformance.map((perf) => ({
    courseId: perf.courseId,
    average: calculateWeightedAverage(perf.scores),
  }))

  return NextResponse.json({
    performance: allPerformance,
    averages: courseAverages,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate required fields
  if (!body.studentId || !body.courseId || !body.score) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const { studentId, courseId, score } = body

  // Validate score object
  if (!score.value || !score.maxValue || !score.type) {
    return NextResponse.json({ error: "Invalid score object" }, { status: 400 })
  }

  // Initialize student data if not exists
  if (!performanceData.has(studentId)) {
    performanceData.set(studentId, new Map())
  }

  const studentData = performanceData.get(studentId)!

  // Initialize course performance if not exists
  if (!studentData.has(courseId)) {
    studentData.set(courseId, {
      studentId,
      courseId,
      scores: [],
    })
  }

  const coursePerformance = studentData.get(courseId)!

  // Add new score
  const newScore: ScoreEntry = {
    id: generateId(),
    value: score.value,
    maxValue: score.maxValue,
    weight: score.weight || 1,
    timestamp: score.timestamp || Date.now(),
    type: score.type,
  }

  coursePerformance.scores.push(newScore)

  // Calculate new average
  const average = calculateWeightedAverage(coursePerformance.scores)

  return NextResponse.json({
    score: newScore,
    average,
  })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const courseId = searchParams.get("courseId")
  const scoreId = searchParams.get("scoreId")

  if (!studentId || !courseId) {
    return NextResponse.json({ error: "Student ID and Course ID are required" }, { status: 400 })
  }

  // Check if student data exists
  if (!performanceData.has(studentId)) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 })
  }

  const studentData = performanceData.get(studentId)!

  // Check if course data exists
  if (!studentData.has(courseId)) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  const coursePerformance = studentData.get(courseId)!

  if (scoreId) {
    // Delete specific score
    const initialLength = coursePerformance.scores.length
    coursePerformance.scores = coursePerformance.scores.filter((score) => score.id !== scoreId)

    if (coursePerformance.scores.length === initialLength) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 })
    }
  } else {
    // Delete all scores for the course
    coursePerformance.scores = []
  }

  return NextResponse.json({ success: true })
}
