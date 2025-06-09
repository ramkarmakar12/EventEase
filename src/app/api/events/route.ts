import { NextResponse } from 'next/server'
import { prisma } from '@/lib/providers'

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
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const event = await prisma.event.create({
      data: {
        title: json.title,
        description: json.description,
        date: new Date(json.date),
        location: json.location,
        capacity: json.capacity,
        isPaid: json.isPaid,
        price: json.price,
        ownerId: json.ownerId,
      },
    })
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
