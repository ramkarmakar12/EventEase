import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

interface Props {
  params: {
    id: string
    rsvpId: string
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { status } = await request.json()

    // Validate status
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, confirmed, or cancelled' },
        { status: 400 }
      )
    }

    // Find RSVP
    const rsvp = await prisma.rSVP.findUnique({
      where: { id: params.rsvpId },
      include: {
        event: {
          include: {
            owner: {
              select: {
                email: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }

    if (rsvp.eventId !== params.id) {
      return NextResponse.json(
        { error: 'RSVP does not belong to this event' },
        { status: 400 }
      )
    }

    // Update RSVP
    const updatedRSVP = await prisma.rSVP.update({
      where: { id: params.rsvpId },
      data: { status },
      include: {
        event: true
      }
    })

    // Send email notifications
    const statusMessage = status === 'confirmed' ? 'confirmed' : 'cancelled'
    
    // To attendee
    await sendEmail({
      to: rsvp.email,
      subject: `RSVP ${statusMessage} - ${rsvp.event.title}`,
      text: `Hi ${rsvp.name},\n\nYour RSVP for "${rsvp.event.title}" has been ${statusMessage}.\n\n${
        status === 'confirmed' ? 
        `Event Details:\nDate: ${rsvp.event.date}\nLocation: ${rsvp.event.location}\n\nWe look forward to seeing you there!` :
        'Thank you for your interest in the event.'
      }\n\nBest regards,\nEventEase Team`
    })

    // To event owner
    await sendEmail({
      to: rsvp.event.owner.email,
      subject: `RSVP ${statusMessage} - ${rsvp.event.title}`,
      text: `Hi ${rsvp.event.owner.name},\n\nAn RSVP for your event "${rsvp.event.title}" has been ${statusMessage}.\n\nAttendee Details:\nName: ${rsvp.name}\nEmail: ${rsvp.email}\n\nBest regards,\nEventEase Team`
    })

    return NextResponse.json(updatedRSVP)
  } catch (error) {
    console.error('RSVP update error:', error)
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    )
  }
}
