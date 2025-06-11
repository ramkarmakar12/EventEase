import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession()
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const { role } = body

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role }
  })

  return NextResponse.json({ user })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession()
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Delete all user's events and RSVPs first
  await prisma.$transaction([
    prisma.rsvp.deleteMany({
      where: {
        event: {
          ownerId: params.id
        }
      }
    }),
    prisma.event.deleteMany({
      where: {
        ownerId: params.id
      }
    }),
    prisma.user.delete({
      where: { id: params.id }
    })
  ])

  return NextResponse.json({ success: true })
}
