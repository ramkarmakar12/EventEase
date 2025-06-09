import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import { prisma } from './prisma';
import type { UserRole } from './auth';

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

    return { user };
  } catch {
    return null;
  }
}
