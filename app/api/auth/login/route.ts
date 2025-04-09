import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Call Django backend for token
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Login failed" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      tokens: {
        access: data.access,
        refresh: data.refresh,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
