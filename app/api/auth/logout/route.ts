import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true })

    // Clear auth cookie
    response.headers.set("Set-Cookie", "auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict")

    // Clear remember me cookie
    response.headers.append("Set-Cookie", "remember_me=; Path=/; Max-Age=0; SameSite=Lax")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}
