'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { BorrowRecord } from '@/types'

interface CheckinDialogProps {
  record: BorrowRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
}

export function CheckinDialog({
  record,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: CheckinDialogProps) {
  if (!record) return null

  const isOverdue = new Date(record.due_date) < new Date()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Book</DialogTitle>
          <DialogDescription>
            Confirm returning this book to the library.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div>
            <p className="text-sm font-medium">Book</p>
            <p className="text-sm text-muted-foreground">
              {record.book?.title || 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Borrowed By</p>
            <p className="text-sm text-muted-foreground">
              {record.user?.full_name || 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Checked Out</p>
            <p className="text-sm text-muted-foreground">
              {new Date(record.checked_out_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Due Date</p>
            <p className={`text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
              {new Date(record.due_date).toLocaleDateString()}
              {isOverdue && ' (OVERDUE)'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
