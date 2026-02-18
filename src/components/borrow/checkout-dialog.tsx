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
import type { Book } from '@/types'

interface CheckoutDialogProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
}

export function CheckoutDialog({
  book,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: CheckoutDialogProps) {
  if (!book) return null

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout Book</DialogTitle>
          <DialogDescription>
            Confirm borrowing this book from the library.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div>
            <p className="text-sm font-medium">Book</p>
            <p className="text-sm text-muted-foreground">{book.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Author</p>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Due Date</p>
            <p className="text-sm text-muted-foreground">
              {dueDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Available Copies</p>
            <p className="text-sm text-muted-foreground">
              {book.available_copies} of {book.total_copies}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
