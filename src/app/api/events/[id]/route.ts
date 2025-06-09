import { NextResponse } from 'next/server'
import { prisma } from '@/lib/providers'

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

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const json = await request.json()
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
    })
    return NextResponse.json(updatedEvent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    await prisma.event.delete({
      where: {
        id: params.id,
      },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
