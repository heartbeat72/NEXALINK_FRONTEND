import { type NextRequest, NextResponse } from "next/server"

// Type definitions for hierarchical structure
type Topic = {
  id: string
  title: string
  content: string
  resources: string[]
}

type Module = {
  id: string
  title: string
  description: string
  topics: Topic[]
}

type Course = {
  id: string
  code: string
  title: string
  description: string
  modules: Module[]
  keywords: string[]
}

// In-memory store (replace with database in production)
const courses: Map<string, Course> = new Map()

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15)

// Search function using BFS
function searchSyllabus(query: string): Course[] {
  if (!query) return Array.from(courses.values())

  const normalizedQuery = query.toLowerCase()
  const results: Course[] = []

  // BFS search through the course hierarchy
  for (const course of courses.values()) {
    // Check if query matches course
    if (
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.description.toLowerCase().includes(normalizedQuery) ||
      course.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))
    ) {
      results.push(course)
      continue
    }

    // Check modules
    const moduleMatch = course.modules.some(
      (module) =>
        module.title.toLowerCase().includes(normalizedQuery) ||
        module.description.toLowerCase().includes(normalizedQuery),
    )

    if (moduleMatch) {
      results.push(course)
      continue
    }

    // Check topics
    const topicMatch = course.modules.some((module) =>
      module.topics.some(
        (topic) =>
          topic.title.toLowerCase().includes(normalizedQuery) || topic.content.toLowerCase().includes(normalizedQuery),
      ),
    )

    if (topicMatch) {
      results.push(course)
    }
  }

  return results
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")
  const query = searchParams.get("query")

  // Return specific course
  if (courseId) {
    const course = courses.get(courseId)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json({ course })
  }

  // Search functionality
  if (query) {
    const results = searchSyllabus(query)
    return NextResponse.json({ courses: results })
  }

  // Return all courses
  return NextResponse.json({
    courses: Array.from(courses.values()),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate required fields
  if (!body.title || !body.code) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const course: Course = {
    id: generateId(),
    code: body.code,
    title: body.title,
    description: body.description || "",
    modules: body.modules || [],
    keywords: body.keywords || [],
  }

  // Store the course
  courses.set(course.id, course)

  return NextResponse.json({ course })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()

  if (!body.id || !courses.has(body.id)) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  const existingCourse = courses.get(body.id)!

  // Update fields
  const updatedCourse: Course = {
    ...existingCourse,
    title: body.title || existingCourse.title,
    code: body.code || existingCourse.code,
    description: body.description || existingCourse.description,
    modules: body.modules || existingCourse.modules,
    keywords: body.keywords || existingCourse.keywords,
  }

  courses.set(body.id, updatedCourse)

  return NextResponse.json({ course: updatedCourse })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id || !courses.has(id)) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  courses.delete(id)

  return NextResponse.json({ success: true })
}
