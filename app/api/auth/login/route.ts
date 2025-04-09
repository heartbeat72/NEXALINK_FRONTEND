import { NextResponse } from "next/server"
import { verifyPassword, generateToken, createAuthCookie, generateRememberMeToken } from "@/lib/auth"

// Mock database for demo purposes
const users = [
  {
    id: "1",
    email: "student@example.com",
    passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // 'student123'
    salt: "abc123",
    role: "student",
    firstName: "Student",
    lastName: "User",
  },
  {
    id: "2",
    email: "faculty@example.com",
    passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // 'faculty123'
    salt: "def456",
    role: "faculty",
    firstName: "Faculty",
    lastName: "Member",
  },
  {
    id: "3",
    email: "admin@example.com",
    passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // 'admin123'
    salt: "ghi789",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.passwordHash, user.salt)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate session token
    const sessionToken = generateToken()
    const expiresIn = 24 * 60 * 60 * 1000 // 24 hours

    // Create auth cookie
    const authCookie = createAuthCookie(sessionToken, expiresIn)

    // Handle remember me functionality
    let rememberMeToken = null
    if (rememberMe) {
      const { selector, validator, hashedValidator } = generateRememberMeToken()
      rememberMeToken = `${selector}:${validator}`

      // In a real app, you would store the selector and hashedValidator in the database
      // associated with the user's ID and with an expiration date (e.g., 30 days)
    }

    // Create response with auth cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    // Set auth cookie
    response.headers.set("Set-Cookie", authCookie)

    // Set remember me cookie if needed
    if (rememberMeToken) {
      const rememberMeExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      response.headers.append(
        "Set-Cookie",
        `remember_me=${rememberMeToken}; Path=/; Expires=${rememberMeExpires.toUTCString()}; SameSite=Lax`,
      )
    }

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
