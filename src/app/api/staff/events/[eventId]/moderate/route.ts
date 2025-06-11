import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await getSession()
  if (!session?.user || session.user.role !== "STAFF") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { status } = await request.json()

  const event = await prisma.event.update({
    where: { id: params.eventId },
    data: { status }
  })

  return NextResponse.json({ event })
}
