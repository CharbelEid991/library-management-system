'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeftRight } from 'lucide-react'
import type { BorrowRecord } from '@/types'

interface BorrowTableProps {
  records: BorrowRecord[]
  loading?: boolean
  onCheckin?: (record: BorrowRecord) => void
}

function getStatusStyle(status: string, isOverdue: boolean) {
  if (isOverdue) return 'border-red-500/30 bg-red-500/10 text-red-700'
  switch (status) {
    case 'checked_out':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-700'
    case 'returned':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
    default:
      return ''
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function BorrowTable({ records, loading, onCheckin }: BorrowTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border">
        <div className="p-4 space-y-4">
          <div className="flex gap-4 border-b pb-3">
            {['w-1/4', 'w-1/5', 'w-1/6', 'w-1/6', 'w-20', 'w-16'].map((w, i) => (
              <Skeleton key={i} className={`h-4 ${w}`} />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <ArrowLeftRight className="h-8 w-8 text-primary/50" />
        </div>
        <p className="text-muted-foreground font-medium">No borrow records found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Checked Out</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const isOverdue =
              record.status === 'checked_out' &&
              new Date(record.due_date) < new Date()

            return (
              <TableRow key={record.id} className="hover:bg-primary/5">
                <TableCell className="font-medium">
                  {record.book?.title || 'Unknown'}
                </TableCell>
                <TableCell className="text-muted-foreground">{record.user?.full_name || 'Unknown'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(record.checked_out_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(record.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusStyle(record.status, isOverdue)}>
                    {isOverdue ? 'Overdue' : formatStatus(record.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {record.status === 'checked_out' && onCheckin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCheckin(record)}
                      className="hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                      Return
                    </Button>
                  )}
                  {record.status === 'returned' && record.returned_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(record.returned_at).toLocaleDateString()}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
