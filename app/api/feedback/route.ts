import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://nexalink-backend.onrender.com/api/v1/feedback/"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = new URLSearchParams()
    searchParams.forEach((value, key) => query.append(key, value))

    const response = await fetch(`${BACKEND_URL}?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Feedback GET error:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Feedback POST error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    const response = await fetch(`${BACKEND_URL}${body.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Feedback PUT error:", error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const replyId = searchParams.get("replyId")

    if (!id) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    const url = replyId
      ? `${BACKEND_URL}${id}/?replyId=${replyId}`
      : `${BACKEND_URL}${id}/`

    const response = await fetch(url, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.detail || "Delete failed" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 })
  }
}
