import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(events);  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get session token from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the session cookie and get the user ID
    const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedClaim.uid;

    // Get user role and verify it's not STAFF
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });    if (user?.role === "STAFF") {
      return NextResponse.json(
        { error: 'Staff members cannot create events' },
        { status: 403 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json();
    const { title, description, date, location, capacity, isPaid, price } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: parseInt(capacity),
        isPaid,
        price: price ? parseFloat(price) : 0,
        ownerId: userId,
      },
      include: {
        owner: true,
      },
    });

    return NextResponse.json(event);
  } catch (error: unknown) {
    console.error('Failed to create event:', error);
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create event', details: message },
      { status: 500 }
    );
  }
}
