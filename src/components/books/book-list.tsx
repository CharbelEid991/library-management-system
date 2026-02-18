'use client'

import { BookCard } from './book-card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen } from 'lucide-react'
import type { Book } from '@/types'

interface BookListProps {
  books: Book[]
  loading?: boolean
  onCheckout?: (book: Book) => void
}

export function BookList({ books, loading, onCheckout }: BookListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <Skeleton className="aspect-[2/3] w-full rounded-none" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <BookOpen className="h-8 w-8 text-primary/50" />
        </div>
        <p className="text-muted-foreground font-medium">No books found.</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onCheckout={onCheckout} />
      ))}
    </div>
  )
}
