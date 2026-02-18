'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Book } from '@/types'
import { BookOpen } from 'lucide-react'

interface BookCardProps {
  book: Book
  onCheckout?: (book: Book) => void
}

export function BookCard({ book, onCheckout }: BookCardProps) {
  const isAvailable = book.available_copies > 0

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[2/3] bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        {book.cover_image ? (
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="h-12 w-12 text-primary/30" />
          </div>
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/books/${book.id}`}>
              <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                {book.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs ${
              isAvailable
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                : 'border-muted bg-muted text-muted-foreground'
            }`}
          >
            {isAvailable ? `${book.available_copies} avail.` : 'Unavailable'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">{book.genre}</Badge>
          {book.published_year && (
            <span className="text-xs text-muted-foreground">{book.published_year}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/books/${book.id}`}>Details</Link>
        </Button>
        {isAvailable && onCheckout && (
          <Button size="sm" className="flex-1 shadow-sm" onClick={() => onCheckout(book)}>
            Borrow
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
