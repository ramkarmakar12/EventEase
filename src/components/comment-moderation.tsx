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

interface Comment {
  id: string
  content: string
  user: {
    name: string
    email: string
  }
  event: {
    title: string
  }
  createdAt: Date
  isHidden: boolean
}

interface CommentModerationProps {
  comments: Comment[]
}

export function CommentModeration({ comments: initialComments }: CommentModerationProps) {
  const [comments, setComments] = useState(initialComments)

  const handleHideComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/staff/comments/${commentId}/hide`, {
        method: 'PUT'
      })

      if (!response.ok) throw new Error('Failed to hide comment')

      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, isHidden: true } : comment
      ))
      toast.success('Comment hidden')
    } catch (error) {
      toast.error('Failed to hide comment')
      console.error('Error hiding comment:', error)
    }
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-4 p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{comment.user.name}</h3>
            <p className="text-sm text-gray-500">
              on {comment.event.title} • {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className="text-sm">{comment.content}</p>

          <div className="flex items-center gap-2">
            {!comment.isHidden ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Hide Comment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hide Comment</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to hide this comment?</p>
                  <div className="flex justify-end gap-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => handleHideComment(comment.id)}
                      >
                        Hide
                      </Button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant="secondary" disabled>
                Hidden
              </Button>
            )}
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <p className="text-center text-gray-500">No comments to moderate</p>
      )}
    </div>
  )
}
