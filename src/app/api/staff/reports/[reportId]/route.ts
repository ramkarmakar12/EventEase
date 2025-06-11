import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { reportId: string } }
) {
  const session = await getSession()
  if (!session?.user || session.user.role !== "STAFF") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { status } = await request.json()

  const report = await prisma.report.update({
    where: { id: params.reportId },
    data: { status }
  })

  // If resolving a report about a comment, hide it
  if (status === 'RESOLVED' && report.commentId) {
    await prisma.comment.update({
      where: { id: report.commentId },
      data: { isHidden: true }
    })
  }

  // If resolving a report about an event, mark it as rejected
  if (status === 'RESOLVED' && report.eventId) {
    await prisma.event.update({
      where: { id: report.eventId },
      data: { status: 'REJECTED' }
    })
  }

  return NextResponse.json({ report })
}
