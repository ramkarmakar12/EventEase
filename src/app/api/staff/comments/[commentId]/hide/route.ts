import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  const session = await getSession()
  if (!session?.user || session.user.role !== "STAFF") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const comment = await prisma.comment.update({
    where: { id: params.commentId },
    data: { isHidden: true }
  })

  return NextResponse.json({ comment })
}
