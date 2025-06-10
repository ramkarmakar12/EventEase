import { formatDistance } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Event } from '@/types/event'

interface EventCardProps {
  event: Event
  onEdit?: () => void
  onDelete?: () => void
  onRSVP?: () => void
  disableRSVP?: boolean
}

export function EventCard({ event, onEdit, onDelete, onRSVP, disableRSVP }: EventCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    window.location.href = `/events/${event.id}`
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <p className="text-sm text-gray-500">
          {formatDistance(new Date(event.date), new Date(), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {event.description}
        </p>
        <div className="space-y-1">
          <p className="text-sm">📍 {event.location}</p>
          {event.capacity && (
            <p className="text-sm">👥 Capacity: {event.capacity}</p>
          )}
          {event.isPaid && (
            <p className="text-sm">💰 Price: ${event.price?.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {onRSVP && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRSVP} 
            disabled={disableRSVP}
          >
            {disableRSVP ? 'RSVP Submitted' : 'RSVP'}
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="outline" size="sm" onClick={onDelete}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
