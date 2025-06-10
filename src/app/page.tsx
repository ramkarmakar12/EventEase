'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/event-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEventId, setSelectedEventId] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    
    try {
      const response = await fetch(`/api/events/${selectedEventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        throw new Error('Failed to RSVP')
      }

      alert('RSVP successful! You will receive a confirmation email.')
      setSelectedEventId('')
    } catch (error) {
      console.error('Error RSVPing:', error)
      alert('Failed to RSVP. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <p>Loading events...</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to EventEase
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Browse and RSVP to exciting events. Create your own events by signing up.
              </p>
            </div>
            <div className="space-x-4">
              <Button onClick={() => router.push('/auth/signup')}>
                Create Events
              </Button>
              <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                Sign In
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={() => setSelectedEventId(event.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedEventId} onOpenChange={(open) => !open && setSelectedEventId('')}>
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
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">RSVP</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
