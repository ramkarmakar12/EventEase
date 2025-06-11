'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EventForm } from '@/components/event-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ProcessedEventFormData } from '@/components/event-form'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

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
            Please sign in to create events.
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
            Staff members do not have permission to create events.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const onSubmit = async (data: ProcessedEventFormData) => {
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
          price: data.price,
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
