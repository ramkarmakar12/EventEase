import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserList } from "@/components/user-list"

export default async function AdminDashboard() {
  const session = await getSession()
  const user = session?.user

  if (!user || user.role !== "ADMIN") {
    redirect("/")
  }

  // Fetch dashboard stats
  const stats = await getDashboardStats()  // Fetch all users for management
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalEvents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalRsvps}</p>
          </CardContent>
        </Card>      </div>      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList initialUsers={users} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latest Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.latestUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.latestEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div>                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">by {event.owner.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

async function getDashboardStats() {
  const [
    totalUsers,
    totalEvents,
    totalRsvps,
    latestUsers,
    latestEvents
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.rSVP.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    }),
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        owner: {
          select: {
            name: true
          }
        }
      }
    })
  ])

  return {
    totalUsers,
    totalEvents,
    totalRsvps,
    latestUsers,
    latestEvents
  }
}
