'use client'

import { EventForm } from '@/components/event-form'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          capacity: data.capacity,
          isPaid: data.isPaid,
          price: data.isPaid ? data.price : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      router.push('/events')
    } catch (error) {
      console.error('Error creating event:', error)
      // Handle error (show toast, etc.)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <EventForm onSubmit={onSubmit} />
    </div>
  )
}
