'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EventForm } from '@/components/event-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ProcessedEventFormData, EventFormData } from '@/components/event-form'
import type { Event } from '@/types/event'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Failed to verify user permissions')
    }
  }, [])

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event')
      }
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event details')
    }
  }, [params.id])

  useEffect(() => {
    Promise.all([fetchEvent(), fetchUser()]).finally(() => setLoading(false))
  }, [fetchEvent, fetchUser])

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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }

      router.push('/events')
    } catch (error) {
      console.error('Error updating event:', error)
      setError(error instanceof Error ? error.message : 'Failed to update event')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            Please sign in to edit events.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (currentUser.role === "STAFF") {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            Staff members do not have permission to edit events.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            Event not found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (currentUser.id !== event.ownerId) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            You do not have permission to edit this event.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Format the event data for the form
  const formData: Partial<EventFormData> = {
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString().slice(0, 16), // Format as YYYY-MM-DDTHH:mm
    location: event.location,
    capacity: event.capacity?.toString() || '',
    isPaid: event.isPaid,
    price: event.price?.toString() || '',
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <EventForm onSubmit={handleSubmit} initialData={formData} isEditing />
    </div>
  )
}
