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

interface ReportsListProps {
  reports: Array<{
    id: string
    reason: string
    status: string
    reporter: {
      name: string
    }
    event?: {
      title: string
    } | null
    comment?: {
      content: string
    } | null
    createdAt: Date
  }>
}

export function ReportsList({ reports: initialReports }: ReportsListProps) {
  const [reports, setReports] = useState(initialReports)

  const handleReport = async (reportId: string, action: 'RESOLVED' | 'DISMISSED') => {
    try {
      const response = await fetch(`/api/staff/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (!response.ok) throw new Error('Failed to handle report')

      setReports(reports.filter(report => report.id !== reportId))
      toast.success(`Report ${action.toLowerCase()}`)
    } catch (error) {
      toast.error('Failed to handle report')
      console.error('Error handling report:', error)
    }
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="flex flex-col gap-4 p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">
              Report by {report.reporter.name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className="text-sm font-medium">Reason:</p>
          <p className="text-sm">{report.reason}</p>

          {report.event && (
            <div>
              <p className="text-sm font-medium">Reported Event:</p>
              <p className="text-sm">{report.event.title}</p>
            </div>
          )}

          {report.comment && (
            <div>
              <p className="text-sm font-medium">Reported Comment:</p>
              <p className="text-sm">{report.comment.content}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={() => handleReport(report.id, 'RESOLVED')}
            >
              Resolve
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Dismiss</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dismiss Report</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to dismiss this report?</p>
                <div className="flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => handleReport(report.id, 'DISMISSED')}
                    >
                      Dismiss
                    </Button>
                  </DialogTrigger>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}

      {reports.length === 0 && (
        <p className="text-center text-gray-500">No pending reports</p>
      )}
    </div>
  )
}
