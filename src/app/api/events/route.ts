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
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get session token from cookies
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the session cookie and get the user ID
    const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedClaim.uid;

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
        ownerId: userId, // Set the owner ID from the authenticated user
      },
      include: {
        owner: true, // Include owner details in the response
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: (error as Error).message },
      { status: 500 }
    );
  }
}
