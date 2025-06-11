import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"
import type { UserRole } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, name, role } = body

    if (!role || !["ADMIN", "STAFF", "EVENT_OWNER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: params.id,
        email,
        name,
        role: role as UserRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // Set custom claims in Firebase Auth
    await adminAuth.setCustomUserClaims(params.id, {
      role: role,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json(
      { error: "Failed to create user", details: (error as Error).message },
      { status: 500 }
    )
  }
}
