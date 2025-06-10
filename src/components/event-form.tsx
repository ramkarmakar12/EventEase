import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, MapPin, Users, DollarSign, CalendarCheck, Ban } from 'lucide-react'

import type { Event } from '@/types/event'

export interface EventFormData {
  title: string
  description: string
  date: string
  location: string
  capacity: string
  isPaid: boolean
  price: string
}

export interface ProcessedEventFormData extends Omit<EventFormData, 'capacity' | 'price'> {
  capacity: number | null
  price: number | null
}

interface EventFormProps {
  onSubmit: (data: ProcessedEventFormData) => Promise<void>
  initialData?: Partial<EventFormData>
  isEditing?: boolean
}

export function EventForm({ onSubmit, initialData, isEditing = false }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    location: initialData?.location || '',
    capacity: initialData?.capacity || '',
    isPaid: initialData?.isPaid || false,
    price: initialData?.price || '',
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Convert string values to proper types before submission
    const processedData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      price: formData.isPaid && formData.price ? parseFloat(formData.price) : null
    }
    await onSubmit(processedData)
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }
  return (
    <Card className="w-full max-w-xl mx-auto shadow-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold text-center">
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Fill in the details below to {isEditing ? 'update your' : 'create a new'} event.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium inline-flex items-center">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Event Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="h-10"
              placeholder="Enter an engaging title"
            />
          </div>
          
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium inline-flex items-center">
              <span className="inline-flex items-center">📝 Description</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e)}
              required
              placeholder="Describe your event in detail"
              className="min-h-[100px] resize-y p-3 text-sm"
            />
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium inline-flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date & Time
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="pl-10 h-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium inline-flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="h-10"
                placeholder="Where is your event?"
              />
            </div>
          </div>

          {/* Capacity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-sm font-medium inline-flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Capacity
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                className="h-10"
                placeholder="Max attendees"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center h-10 bg-background border rounded-md px-3">
                <input
                  id="isPaid"
                  name="isPaid"
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPaid" className="text-sm font-medium ml-2 inline-flex items-center cursor-pointer">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Paid Event
                </Label>
              </div>

              {formData.isPaid && (
                <div className="relative">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="pl-6 h-10"
                    placeholder="0.00"
                  />
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 pb-4 px-6">
          <Button 
            type="submit" 
            className="px-6 h-10 text-sm"
          >
            {isEditing ? (
              <>
                <CalendarCheck className="w-4 h-4 mr-2" />
                Update Event
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
