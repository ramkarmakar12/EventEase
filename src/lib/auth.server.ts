import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import { prisma } from './prisma';
import type { UserRole } from './auth';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = await cookieStore.get('session');
    if (!sessionCookie?.value) return null;

    const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie.value);
    
    // Get user data from Prisma
    const user = await prisma.user.findUnique({
      where: { id: decodedClaim.uid },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) return null;

    // Validate that the role is a valid UserRole
    if (!['ADMIN', 'STAFF', 'EVENT_OWNER'].includes(user.role as string)) {
      console.error(`Invalid role found for user ${user.id}: ${user.role}`);
      return null;
    }

    return { user: user as SessionUser };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}
