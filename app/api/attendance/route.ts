import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://nexalink-backend.onrender.com/api/v1/attendance/"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = new URLSearchParams()
    searchParams.forEach((value, key) => query.append(key, value))

    const backendResponse = await fetch(`${BACKEND_URL}?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await backendResponse.json()
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error("Attendance GET error:", error)
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendResponse = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error("Attendance POST error:", error)
    return NextResponse.json({ error: "Failed to create attendance record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Attendance ID is required" }, { status: 400 })
    }

    const backendResponse = await fetch(`${BACKEND_URL}${body.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error("Attendance PUT error:", error)
    return NextResponse.json({ error: "Failed to update attendance record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Attendance ID is required" }, { status: 400 })
    }

    const backendResponse = await fetch(`${BACKEND_URL}${id}/`, {
      method: "DELETE",
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json({ error: errorData.detail || "Delete failed" }, { status: backendResponse.status })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Attendance DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete attendance record" }, { status: 500 })
  }
}
