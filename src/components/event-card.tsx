import { formatDistance } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: Date
    location: string
    capacity?: number
    isPaid: boolean
    price?: number
  }
  onEdit?: () => void
  onDelete?: () => void
  onRSVP?: () => void
}

export function EventCard({ event, onEdit, onDelete, onRSVP }: EventCardProps) {
  return (
    <Card className="h-full flex flex-col">
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
          <Button variant="default" size="sm" onClick={onRSVP}>
            RSVP
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
