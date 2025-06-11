'use client'

import { useState } from "react"
import { toast } from "sonner"
import { User } from "@prisma/client"
import { UserManagement } from "./user-management"

interface UserListProps {
  initialUsers: User[]
}

export function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState(initialUsers)

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error('Failed to update user role')

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      toast.success('User role updated successfully')
    } catch (error) {
      toast.error('Failed to update user role')
      console.error('Error updating user role:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete user')

      setUsers(users.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserManagement
          key={user.id}
          user={user}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
        />
      ))}
    </div>
  )
}
