'use client'

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

interface EventModerationProps {
  events: Array<{
    id: string
    title: string
    description: string
    date: Date
    owner: {
      name: string
      email: string
    }
    _count: {
      rsvps: number
    }
  }>
}

export function EventModeration({ events }: EventModerationProps) {
  const [pendingEvents, setPendingEvents] = useState(events)

  const handleModeration = async (eventId: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/staff/events/${eventId}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (!response.ok) throw new Error('Failed to moderate event')

      setPendingEvents(pendingEvents.filter(event => event.id !== eventId))
      toast.success(`Event ${action.toLowerCase()}`)
    } catch (error) {
      toast.error('Failed to moderate event')
      console.error('Error moderating event:', error)
    }
  }

  return (
    <div className="space-y-4">
      {pendingEvents.map((event) => (
        <div key={event.id} className="flex flex-col gap-4 p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-gray-500">by {event.owner.name}</p>
          </div>
          
          <p className="text-sm">{event.description}</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{new Date(event.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{event._count.rsvps} RSVPs</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={() => handleModeration(event.id, 'APPROVED')}
            >
              Approve
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Reject</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Event</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to reject this event?</p>
                <div className="flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => handleModeration(event.id, 'REJECTED')}
                    >
                      Reject
                    </Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}

      {pendingEvents.length === 0 && (
        <p className="text-center text-gray-500">No events pending review</p>
      )}
    </div>
  )
}
