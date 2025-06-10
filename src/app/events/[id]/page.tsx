'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Users, DollarSign, Share2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Event } from '@/types/event'

interface RSVP {
  id: string
  name: string
  email: string
  status: string
  createdAt: string
}

interface EventWithRSVPs extends Event {
  rsvps: RSVP[]
  owner?: {
    id: string
    email: string
    name: string
  }
}

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<EventWithRSVPs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showShareLink, setShowShareLink] = useState(false)
  const [showRSVPForm, setShowRSVPForm] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  const publicUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/events/${params.id}` : ''

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
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
      setError('')
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event details. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchEvent()
    fetchUser()
  }, [fetchEvent, fetchUser])

  const handleRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    
    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        throw new Error('Failed to RSVP')
      }

      setShowRSVPForm(false)
      alert('RSVP successful! You will receive a confirmation email.')
      fetchEvent()
    } catch (error) {
      console.error('Error RSVPing:', error)
      alert('Failed to RSVP. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Event not found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const isOwner = currentUser?.id === event.owner?.id

  return (
    <div className="container mx-auto py-8 space-y-6">
      {!currentUser && (
        <Alert>
          <AlertDescription>
            You are viewing this event in public mode. Sign in to access additional features.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Event Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="mt-2">
                <p className="text-base">{event.description}</p>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={showShareLink} onOpenChange={setShowShareLink}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Share this link with potential attendees:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={publicUrl}
                        className="flex-1 px-3 py-2 border rounded-md bg-muted"
                      />
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(publicUrl)
                          alert('Link copied to clipboard!')
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {isOwner && (
                <Button variant="outline" size="sm" onClick={() => router.push(`/events/${params.id}/edit`)}>
                  Edit Event
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(event.date).toLocaleDateString()}
                <Clock className="w-4 h-4 ml-4 mr-2" />
                {new Date(event.date).toLocaleTimeString()}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              {event.capacity && (
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {event.rsvps.filter(r => r.status === 'confirmed').length} / {event.capacity} spots filled
                </div>
              )}
              {event.isPaid && (
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${event.price?.toFixed(2)}
                </div>
              )}

              <div className="pt-4">
                <Dialog open={showRSVPForm} onOpenChange={setShowRSVPForm}>
                  <DialogTrigger asChild>
                    <Button>RSVP to Event</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>RSVP to Event</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRSVP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowRSVPForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">RSVP</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendee Management Card - Only visible to event owner */}
      {isOwner && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Attendees ({event.rsvps.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">RSVP Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {event.rsvps.map(rsvp => (
                    <tr key={rsvp.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{rsvp.name}</td>
                      <td className="py-3 px-4">{rsvp.email}</td>
                      <td className="py-3 px-4">
                        {new Date(rsvp.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          rsvp.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : rsvp.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
