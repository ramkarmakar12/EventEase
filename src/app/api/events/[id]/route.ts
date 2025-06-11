import { NextResponse } from 'next/server'
import { prisma } from '@/lib/providers'
import { adminAuth } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

interface Props {
  params: { id: string }
}

export async function GET(request: Request, { params }: Props) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rsvps: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)  } catch (error) {
    console.error('Failed to fetch event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

import type { ProcessedEventFormData } from '@/components/event-form'

export async function PUT(request: Request, { params }: Props) {
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

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === "STAFF") {
      return NextResponse.json(
        { error: 'Staff members cannot modify events' },
        { status: 403 }
      );
    }

    // Find the event and check ownership
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { ownerId: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only allow owner or admin to modify
    if (event.ownerId !== userId && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Only the event owner can modify this event' },
        { status: 403 }
      );
    }

    const json = await request.json() as ProcessedEventFormData;
    const updatedEvent = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        title: json.title,
        description: json.description,
        date: new Date(json.date),
        location: json.location,
        capacity: json.capacity,
        isPaid: json.isPaid,
        price: json.price,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error: unknown) {
    console.error('Failed to update event:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update event', details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
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

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === "STAFF") {
      return NextResponse.json(
        { error: 'Staff members cannot delete events' },
        { status: 403 }
      );
    }

    // Find the event and check ownership
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { ownerId: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only allow owner or admin to delete
    if (event.ownerId !== userId && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Only the event owner can delete this event' },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('Failed to delete event:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to delete event', details: message },
      { status: 500 }
    );
  }
}
