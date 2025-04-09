import { type NextRequest, NextResponse } from "next/server"

// Type definitions
type AttendanceRecord = {
  studentId: string
  courseId: string
  date: string
  status: "present" | "absent" | "late"
}

type PerformanceRecord = {
  studentId: string
  courseId: string
  scoreType: string
  score: number
  maxScore: number
  date: string
}

type EngagementRecord = {
  userId: string
  userType: "student" | "faculty" | "admin"
  action: string
  timestamp: number
}

// In-memory stores (replace with database in production)
const attendanceRecords: AttendanceRecord[] = []
const performanceRecords: PerformanceRecord[] = []
const engagementRecords: EngagementRecord[] = []

// Helper functions
function calculateAttendancePercentage(studentId: string, courseId?: string): number {
  const records = attendanceRecords.filter(
    (record) => record.studentId === studentId && (courseId ? record.courseId === courseId : true),
  )

  if (records.length === 0) return 0

  const presentCount = records.filter((record) => record.status === "present" || record.status === "late").length

  return (presentCount / records.length) * 100
}

function calculateAveragePerformance(studentId: string, courseId?: string): number {
  const records = performanceRecords.filter(
    (record) => record.studentId === studentId && (courseId ? record.courseId === courseId : true),
  )

  if (records.length === 0) return 0

  const totalPercentage = records.reduce((sum, record) => {
    return sum + (record.score / record.maxScore) * 100
  }, 0)

  return totalPercentage / records.length
}

function calculatePerformanceTrend(studentId: string, courseId?: string, days = 30): number[] {
  const now = Date.now()
  const startTime = now - days * 24 * 60 * 60 * 1000

  // Group records by day
  const dailyScores: Map<string, number[]> = new Map()

  performanceRecords
    .filter(
      (record) =>
        record.studentId === studentId &&
        (courseId ? record.courseId === courseId : true) &&
        new Date(record.date).getTime() >= startTime,
    )
    .forEach((record) => {
      const day = record.date.split("T")[0]
      if (!dailyScores.has(day)) {
        dailyScores.set(day, [])
      }
      dailyScores.get(day)!.push((record.score / record.maxScore) * 100)
    })

  // Calculate daily averages
  const result: { day: string; average: number }[] = []

  for (const [day, scores] of dailyScores.entries()) {
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    result.push({ day, average })
  }

  // Sort by day
  result.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())

  // Return just the averages
  return result.map((item) => item.average)
}

function getTopPerformers(courseId: string, limit = 5): { studentId: string; average: number }[] {
  // Get unique student IDs
  const studentIds = new Set(
    performanceRecords.filter((record) => record.courseId === courseId).map((record) => record.studentId),
  )

  // Calculate average for each student
  const studentAverages: { studentId: string; average: number }[] = []

  for (const studentId of studentIds) {
    const average = calculateAveragePerformance(studentId, courseId)
    studentAverages.push({ studentId, average })
  }

  // Sort by average (descending) and take top performers
  return studentAverages.sort((a, b) => b.average - a.average).slice(0, limit)
}

function getMostEngagedUsers(days = 30, limit = 5): { userId: string; userType: string; count: number }[] {
  const now = Date.now()
  const startTime = now - days * 24 * 60 * 60 * 1000

  // Filter recent records
  const recentRecords = engagementRecords.filter((record) => record.timestamp >= startTime)

  // Count actions by user
  const userCounts: Map<string, { userId: string; userType: string; count: number }> = new Map()

  recentRecords.forEach((record) => {
    const key = `${record.userType}-${record.userId}`
    if (!userCounts.has(key)) {
      userCounts.set(key, {
        userId: record.userId,
        userType: record.userType,
        count: 0,
      })
    }
    userCounts.get(key)!.count++
  })

  // Sort by count and take top users
  return Array.from(userCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const courseId = searchParams.get("courseId")
  const metric = searchParams.get("metric")
  const days = Number.parseInt(searchParams.get("days") || "30")
  const limit = Number.parseInt(searchParams.get("limit") || "5")

  // Return specific metrics
  if (metric) {
    switch (metric) {
      case "attendance":
        if (!studentId) {
          return NextResponse.json({ error: "Student ID is required for attendance metrics" }, { status: 400 })
        }
        return NextResponse.json({
          attendance: calculateAttendancePercentage(studentId, courseId || undefined),
        })

      case "performance":
        if (!studentId) {
          return NextResponse.json({ error: "Student ID is required for performance metrics" }, { status: 400 })
        }
        return NextResponse.json({
          average: calculateAveragePerformance(studentId, courseId || undefined),
          trend: calculatePerformanceTrend(studentId, courseId || undefined, days),
        })

      case "topPerformers":
        if (!courseId) {
          return NextResponse.json({ error: "Course ID is required for top performers" }, { status: 400 })
        }
        return NextResponse.json({
          topPerformers: getTopPerformers(courseId, limit),
        })

      case "engagement":
        return NextResponse.json({
          mostEngaged: getMostEngagedUsers(days, limit),
        })

      default:
        return NextResponse.json({ error: "Invalid metric" }, { status: 400 })
    }
  }

  // Return comprehensive dashboard data
  if (studentId) {
    // Student dashboard
    return NextResponse.json({
      attendance: calculateAttendancePercentage(studentId),
      performance: {
        average: calculateAveragePerformance(studentId),
        trend: calculatePerformanceTrend(studentId, undefined, days),
      },
    })
  } else if (courseId) {
    // Course dashboard
    return NextResponse.json({
      topPerformers: getTopPerformers(courseId, limit),
    })
  } else {
    // General dashboard
    return NextResponse.json({
      mostEngaged: getMostEngagedUsers(days, limit),
    })
  }
}

// POST endpoint to add analytics data (for testing)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const dataType = body.dataType

  if (!dataType) {
    return NextResponse.json({ error: "Data type is required" }, { status: 400 })
  }

  switch (dataType) {
    case "attendance":
      if (!body.studentId || !body.courseId || !body.date || !body.status) {
        return NextResponse.json({ error: "Missing required fields for attendance" }, { status: 400 })
      }
      attendanceRecords.push({
        studentId: body.studentId,
        courseId: body.courseId,
        date: body.date,
        status: body.status,
      })
      break

    case "performance":
      if (
        !body.studentId ||
        !body.courseId ||
        !body.scoreType ||
        body.score === undefined ||
        body.maxScore === undefined ||
        !body.date
      ) {
        return NextResponse.json({ error: "Missing required fields for performance" }, { status: 400 })
      }
      performanceRecords.push({
        studentId: body.studentId,
        courseId: body.courseId,
        scoreType: body.scoreType,
        score: body.score,
        maxScore: body.maxScore,
        date: body.date,
      })
      break

    case "engagement":
      if (!body.userId || !body.userType || !body.action) {
        return NextResponse.json({ error: "Missing required fields for engagement" }, { status: 400 })
      }
      engagementRecords.push({
        userId: body.userId,
        userType: body.userType,
        action: body.action,
        timestamp: body.timestamp || Date.now(),
      })
      break

    default:
      return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
