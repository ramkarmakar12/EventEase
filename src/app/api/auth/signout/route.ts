import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // Clear the session cookie
  cookies().delete('session')
  
  // Redirect to homepage after signout
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
    status: 303
  })
}
