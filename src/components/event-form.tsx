import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface EventFormProps {
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isEditing?: boolean
}

export function EventForm({ onSubmit, initialData, isEditing = false }: EventFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    isPaid: false,
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="isPaid"
              name="isPaid"
              type="checkbox"
              checked={formData.isPaid}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <Label htmlFor="isPaid">Paid Event</Label>
          </div>
          {formData.isPaid && (
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit">{isEditing ? 'Update Event' : 'Create Event'}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
