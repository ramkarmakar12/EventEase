export interface Event {
  id: string
  title: string
  description: string
  date: string | Date
  location: string
  capacity?: number
  isPaid: boolean
  price?: number
  ownerId: string
  owner?: {
    id: string
    name: string
    email: string
  }
  rsvps?: any[]
  createdAt: string | Date
  updatedAt: string | Date
}
