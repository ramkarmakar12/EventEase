'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { EventForm } from '@/components/event-form'
import type { ProcessedEventFormData } from '@/components/event-form'

export default function EditEventPage() {
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event')
      }
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleSubmit = async (data: ProcessedEventFormData) => {
    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update event')
      }

      // Redirect to the events page after successful update
      window.location.href = '/events'
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <p>Event not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm onSubmit={handleSubmit} initialData={event} isEditing />
    </div>
  )
}
