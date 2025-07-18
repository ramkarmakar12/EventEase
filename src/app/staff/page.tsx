import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventModeration } from "@/components/event-moderation"
import { ReportsList } from "@/components/reports-list"
import { CommentModeration } from "@/components/comment-moderation"
import { EventStatus, ReportStatus } from "@prisma/client"

export default async function StaffDashboard() {
  const session = await getSession()
  const user = session?.user

  if (!user || user.role !== "STAFF") {
    redirect("/")
  }

  const [pendingEvents, flaggedComments, pendingReports] = await Promise.all([
    // Fetch events pending review
    prisma.event.findMany({
      where: { 
        status: EventStatus.PENDING_REVIEW 
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: { rsvps: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),

    // Fetch flagged comments
    prisma.comment.findMany({
      where: {
        reports: {
          some: {
            status: ReportStatus.PENDING
          }
        },
        isHidden: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),

    // Fetch pending reports
    prisma.report.findMany({
      where: { 
        status: ReportStatus.PENDING 
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true
          }
        },
        event: {
          select: {
            id: true,
            title: true
          }
        },
        comment: {
          select: {
            id: true,
            content: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <main className="container py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Flagged Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{flaggedComments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {pendingEvents.reduce((sum, event) => sum + event._count.rsvps, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Events Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <EventModeration events={pendingEvents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reported Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsList reports={pendingReports} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Flagged Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentModeration comments={flaggedComments} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}