import { createUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { UserRole } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate role
    const allowedRoles: UserRole[] = ['EVENT_OWNER', 'STAFF']
    if (role && !allowedRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    const { idToken } = await createUser(email, password, name, (role || 'EVENT_OWNER') as UserRole)

    return NextResponse.json({ idToken })
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create account' },
      { status: 400 }
    )
  }
}
