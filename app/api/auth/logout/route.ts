export async function POST() {
  try {
    // Clear client-side state (optional depending on your frontend setup)
    // E.g., remove token from localStorage or use a context to reset auth state

    const response = NextResponse.json({ success: true })

    // Remove cookies (if set)
    response.headers.set("Set-Cookie", "auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict")
    response.headers.append("Set-Cookie", "remember_me=; Path=/; Max-Age=0; SameSite=Lax")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}
