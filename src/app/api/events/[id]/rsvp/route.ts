import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

interface Props {
  params: { id: string }
}

export async function POST(request: Request, { params }: Props) {
  try {
    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if the event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        rsvps: true,
        owner: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check capacity if it's set
    if (event.capacity && event.rsvps.length >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at full capacity' },
        { status: 400 }
      )
    }

    // Check if user has already RSVP'd
    const existingRSVP = await prisma.rSVP.findFirst({
      where: {
        eventId: params.id,
        email: email,
      }
    })

    if (existingRSVP) {
      return NextResponse.json(
        { error: 'You have already RSVP\'d to this event' },
        { status: 400 }
      )
    }

    // Create RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        email,
        eventId: params.id,
        status: 'confirmed',
      }
    })

    // Send confirmation emails
    // To attendee
    await sendEmail({
      to: email,
      subject: `RSVP Confirmation - ${event.title}`,
      text: `Hi ${name},\n\nYour RSVP for "${event.title}" has been confirmed.\n\nEvent Details:\nDate: ${event.date}\nLocation: ${event.location}\n\nWe look forward to seeing you there!\n\nBest regards,\nEventEase Team`
    })

    // To event owner
    await sendEmail({
      to: event.owner.email,
      subject: `New RSVP - ${event.title}`,
      text: `Hi ${event.owner.name},\n\nA new attendee has RSVP'd to your event "${event.title}".\n\nAttendee Details:\nName: ${name}\nEmail: ${email}\n\nBest regards,\nEventEase Team`
    })

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Failed to RSVP' },
      { status: 500 }
    )
  }
}
