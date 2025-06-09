import { signIn } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { idToken } = await signIn(email, password)

    return NextResponse.json({ idToken })
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid credentials' },
      { status: 401 }
    )
  }
}
