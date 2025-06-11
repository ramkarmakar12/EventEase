import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSession()
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const [
    totalUsers,
    totalEvents,
    totalRsvps,
    latestUsers,
    latestEvents,
    eventsByMonth
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.rsvp.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        organizer: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*) as count
      FROM "Event"
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `
  ])

  return NextResponse.json({
    stats: {
      totalUsers,
      totalEvents,
      totalRsvps,
      latestUsers,
      latestEvents,
      eventsByMonth
    }
  })
}
