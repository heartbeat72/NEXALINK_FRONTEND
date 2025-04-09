import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://nexalink-backend.onrender.com/api/v1/analytics/"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const params = url.searchParams

    const query = new URLSearchParams()
    params.forEach((value, key) => query.append(key, value))

    const backendResponse = await fetch(`${BACKEND_URL}?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await backendResponse.json()
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
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
    console.error("Analytics POST error:", error)
    return NextResponse.json({ error: "Failed to submit analytics data" }, { status: 500 })
  }
}
