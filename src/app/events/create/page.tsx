'use client'

import { EventForm } from '@/components/event-form'

export default function CreateEventPage() {
  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      // Redirect to the events page after successful creation
      window.location.href = '/events'
    } catch (error) {
      console.error('Error creating event:', error)
      // Handle error (show message to user, etc.)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  )
}
