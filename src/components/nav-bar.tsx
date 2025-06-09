import Link from "next/link"
import { Button } from "./ui/button"
import { getSession } from "@/lib/auth.server"

export async function NavBar() {
  const session = await getSession()
  const user = session?.user

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold">
          EventEase
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/events">
                <Button variant="ghost">Events</Button>
              </Link>
              {user.role === "EVENT_OWNER" && (
                <Link href="/events/create">
                  <Button>Create Event</Button>
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost">Admin Dashboard</Button>
                </Link>
              )}
              {user.role === "STAFF" && (
                <Link href="/staff">
                  <Button variant="ghost">Staff Dashboard</Button>
                </Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <Button variant="ghost" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
