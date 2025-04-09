import { NextResponse } from "next/server"

// Mock database for user preferences
const userPreferences = [
  { userId: "1", theme: "light" },
  { userId: "2", theme: "dark" },
  { userId: "3", theme: "system" },
]

export async function GET(request: Request) {
  try {
    // In a real app, you would extract the user ID from the session
    // For demo purposes, we'll use a query parameter
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Find user preferences
    const preferences = userPreferences.find((p) => p.userId === userId)

    if (!preferences) {
      return NextResponse.json(
        { theme: "light" }, // Default theme if no preferences found
      )
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Get preferences error:", error)
    return NextResponse.json({ error: "An error occurred while fetching preferences" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, theme } = await request.json()

    // Validate input
    if (!userId || !theme) {
      return NextResponse.json({ error: "User ID and theme are required" }, { status: 400 })
    }

    // Validate theme value
    if (!["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme value" }, { status: 400 })
    }

    // Find user preferences index
    const index = userPreferences.findIndex((p) => p.userId === userId)

    if (index === -1) {
      // Create new preferences
      userPreferences.push({ userId, theme })
    } else {
      // Update existing preferences
      userPreferences[index].theme = theme
    }

    return NextResponse.json({ success: true, theme })
  } catch (error) {
    console.error("Update preferences error:", error)
    return NextResponse.json({ error: "An error occurred while updating preferences" }, { status: 500 })
  }
}
