import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

// Max age of the session cookie in seconds (5 days)
const SESSION_EXPIRATION_TIME = 60 * 60 * 24 * 5

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: "No ID token provided" },
        { status: 400 }
      )
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRATION_TIME * 1000, // Convert to milliseconds
    })

    // Set the session cookie
    cookies().set('session', sessionCookie, {
      maxAge: SESSION_EXPIRATION_TIME,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    )
  }
}
