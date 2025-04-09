import { type NextRequest, NextResponse } from "next/server"

// Type definitions
type Attendance = {
  id: string
  studentId: string
  courseId: string
  date: string
  status: "present" | "absent" | "late"
  timestamp: number
}

// In-memory store (replace with database in production)
const attendanceRecords: Map<string, Attendance> = new Map()

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15)
const getDateString = (date: Date) => date.toISOString().split("T")[0]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("studentId")
  const courseId = searchParams.get("courseId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  // Convert to array for filtering
  let records = Array.from(attendanceRecords.values())

  // Apply filters
  if (studentId) {
    records = records.filter((record) => record.studentId === studentId)
  }

  if (courseId) {
    records = records.filter((record) => record.courseId === courseId)
  }

  if (startDate && endDate) {
    records = records.filter((record) => {
      return record.date >= startDate && record.date <= endDate
    })
  }

  // Sort by date (newest first)
  records.sort((a, b) => b.timestamp - a.timestamp)

  return NextResponse.json({ records })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate required fields
  if (!body.studentId || !body.courseId || !body.status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const date = body.date ? new Date(body.date) : new Date()

  const attendance: Attendance = {
    id: generateId(),
    studentId: body.studentId,
    courseId: body.courseId,
    date: getDateString(date),
    status: body.status,
    timestamp: date.getTime(),
  }

  // Store the record
  attendanceRecords.set(attendance.id, attendance)

  return NextResponse.json({ attendance })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()

  if (!body.id || !attendanceRecords.has(body.id)) {
    return NextResponse.json({ error: "Attendance record not found" }, { status: 404 })
  }

  const existingRecord = attendanceRecords.get(body.id)!

  // Update fields
  const updatedRecord: Attendance = {
    ...existingRecord,
    status: body.status || existingRecord.status,
    date: body.date ? getDateString(new Date(body.date)) : existingRecord.date,
    timestamp: body.date ? new Date(body.date).getTime() : existingRecord.timestamp,
  }

  attendanceRecords.set(body.id, updatedRecord)

  return NextResponse.json({ attendance: updatedRecord })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id || !attendanceRecords.has(id)) {
    return NextResponse.json({ error: "Attendance record not found" }, { status: 404 })
  }

  attendanceRecords.delete(id)

  return NextResponse.json({ success: true })
}
