import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from "@prisma/client"

interface UserManagementProps {
  user: User
  onRoleChange: (userId: string, newRole: string) => Promise<void>
  onDeleteUser: (userId: string) => Promise<void>
}

export function UserManagement({
  user,
  onRoleChange,
  onDeleteUser,
}: UserManagementProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          defaultValue={user.role}
          onValueChange={(value) => onRoleChange(user.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="EVENT_OWNER">Event Owner</SelectItem>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <p>
                This will delete the user and all their events. This action cannot
                be undone.
              </p>
            </DialogHeader>
            <div className="flex justify-end gap-4">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => onDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </DialogTrigger>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
