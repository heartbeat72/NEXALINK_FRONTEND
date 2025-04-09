import { type NextRequest, NextResponse } from "next/server"

// Type definitions
type IAMark = {
  id: string
  studentId: string
  courseId: string
  iaNumber: number
  marks: number
  maxMarks: number
  date: string
  facultyId: string
  remarks?: string
}

// In-memory store (replace with database in production)
const iaMarks: Map<string, IAMark> = new Map()

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15)

// Calculate grade based on percentage
function calculateGrade(marks: number, maxMarks: number): string {
  const percentage = (marks / maxMarks) * 100

  if (percentage >= 90) return "A+"
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B+"
  if (percentage >= 60) return "B"
  if (percentage >= 50) return "C"
  if (percentage >= 40) return "D"
  return "F"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const courseId = searchParams.get("courseId")
  const iaNumber = searchParams.get("iaNumber")
  const facultyId = searchParams.get("facultyId")

  // Convert to array for filtering
  let records = Array.from(iaMarks.values())

  // Apply filters
  if (studentId) {
    records = records.filter((record) => record.studentId === studentId)
  }

  if (courseId) {
    records = records.filter((record) => record.courseId === courseId)
  }

  if (iaNumber) {
    records = records.filter((record) => record.iaNumber === Number.parseInt(iaNumber))
  }

  if (facultyId) {
    records = records.filter((record) => record.facultyId === facultyId)
  }

  // Calculate statistics if requested
  const calculateStats = searchParams.get("stats") === "true"

  if (calculateStats && records.length > 0) {
    // Group by course and IA number
    const statsByGroup: Map<
      string,
      {
        total: number
        count: number
        min: number
        max: number
        distribution: Record<string, number>
      }
    > = new Map()

    records.forEach((record) => {
      const key = `${record.courseId}-${record.iaNumber}`

      if (!statsByGroup.has(key)) {
        statsByGroup.set(key, {
          total: 0,
          count: 0,
          min: Number.POSITIVE_INFINITY,
          max: Number.NEGATIVE_INFINITY,
          distribution: { "A+": 0, A: 0, "B+": 0, B: 0, C: 0, D: 0, F: 0 },
        })
      }

      const stats = statsByGroup.get(key)!
      stats.total += record.marks
      stats.count++
      stats.min = Math.min(stats.min, record.marks)
      stats.max = Math.max(stats.max, record.marks)

      const grade = calculateGrade(record.marks, record.maxMarks)
      stats.distribution[grade]++
    })

    // Calculate averages and format results
    const statistics = Array.from(statsByGroup.entries()).map(([key, stats]) => {
      const [courseId, iaNumber] = key.split("-")
      return {
        courseId,
        iaNumber: Number.parseInt(iaNumber),
        average: stats.total / stats.count,
        min: stats.min,
        max: stats.max,
        distribution: stats.distribution,
      }
    })

    return NextResponse.json({ records, statistics })
  }

  // Add grades to records
  const recordsWithGrades = records.map((record) => ({
    ...record,
    grade: calculateGrade(record.marks, record.maxMarks),
  }))

  return NextResponse.json({ records: recordsWithGrades })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate required fields
  if (
    !body.studentId ||
    !body.courseId ||
    body.iaNumber === undefined ||
    body.marks === undefined ||
    !body.maxMarks ||
    !body.facultyId
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Validate marks
  if (body.marks < 0 || body.marks > body.maxMarks) {
    return NextResponse.json({ error: "Invalid marks value" }, { status: 400 })
  }

  const iaMark: IAMark = {
    id: generateId(),
    studentId: body.studentId,
    courseId: body.courseId,
    iaNumber: body.iaNumber,
    marks: body.marks,
    maxMarks: body.maxMarks,
    date: body.date || new Date().toISOString().split("T")[0],
    facultyId: body.facultyId,
    remarks: body.remarks,
  }

  // Store the record
  iaMarks.set(iaMark.id, iaMark)

  // Calculate grade
  const grade = calculateGrade(iaMark.marks, iaMark.maxMarks)

  return NextResponse.json({
    iaMark: {
      ...iaMark,
      grade,
    },
  })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()

  if (!body.id || !iaMarks.has(body.id)) {
    return NextResponse.json({ error: "IA mark record not found" }, { status: 404 })
  }

  const existingRecord = iaMarks.get(body.id)!

  // Validate marks if provided
  if (body.marks !== undefined) {
    const maxMarks = body.maxMarks || existingRecord.maxMarks
    if (body.marks < 0 || body.marks > maxMarks) {
      return NextResponse.json({ error: "Invalid marks value" }, { status: 400 })
    }
  }

  // Update fields
  const updatedRecord: IAMark = {
    ...existingRecord,
    marks: body.marks !== undefined ? body.marks : existingRecord.marks,
    maxMarks: body.maxMarks || existingRecord.maxMarks,
    remarks: body.remarks !== undefined ? body.remarks : existingRecord.remarks,
  }

  iaMarks.set(body.id, updatedRecord)

  // Calculate grade
  const grade = calculateGrade(updatedRecord.marks, updatedRecord.maxMarks)

  return NextResponse.json({
    iaMark: {
      ...updatedRecord,
      grade,
    },
  })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id || !iaMarks.has(id)) {
    return NextResponse.json({ error: "IA mark record not found" }, { status: 404 })
  }

  iaMarks.delete(id)

  return NextResponse.json({ success: true })
}
