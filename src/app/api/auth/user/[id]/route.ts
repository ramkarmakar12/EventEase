import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

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

    return NextResponse.json(user)
  } catch (error) {
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

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: params.id,
        email,
        name,
        role,
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
