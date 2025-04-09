import { type NextRequest, NextResponse } from "next/server"

const BACKEND_API = "https://nexalink-backend.onrender.com/api/ia-marks"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = new URL(BACKEND_API)

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })

  const res = await fetch(url.toString())
  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(BACKEND_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(BACKEND_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = new URL(BACKEND_API)

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value)
  })

  const res = await fetch(url.toString(), { method: "DELETE" })
  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}
