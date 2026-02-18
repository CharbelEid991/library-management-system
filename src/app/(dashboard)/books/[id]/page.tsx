'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useBook, useDeleteBook } from '@/hooks/use-books'
import { useCheckout } from '@/hooks/use-borrow'
import { useUser } from '@/hooks/use-user'
import { PageHeader } from '@/components/layout/page-header'
import { CheckoutDialog } from '@/components/borrow/checkout-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, BookOpen, Edit, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: book, isLoading } = useBook(id)
  const deleteBook = useDeleteBook()
  const checkout = useCheckout()
  const { profile } = useUser()
  const router = useRouter()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const isAdmin = profile?.role === 'admin' || profile?.role === 'librarian'

  const handleDelete = async () => {
    if (!book || !confirm('Are you sure you want to delete this book?')) return
    try {
      await deleteBook.mutateAsync(book.id)
      toast.success('Book deleted')
      router.push('/books')
    } catch {
      toast.error('Failed to delete book')
    }
  }

  const confirmCheckout = async () => {
    if (!book || !profile) return
    try {
      await checkout.mutateAsync({ bookId: book.id, userId: profile.id })
      toast.success(`"${book.title}" checked out successfully!`)
      setCheckoutOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card overflow-hidden">
            <Skeleton className="aspect-[2/3] w-full rounded-none" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Separator />
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <BookOpen className="h-8 w-8 text-primary/50" />
        </div>
        <p className="text-muted-foreground font-medium">Book not found.</p>
        <Button asChild variant="link" className="mt-2 text-primary">
          <Link href="/books">Back to books</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary">
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-[2/3] bg-gradient-to-br from-primary/5 to-primary/10">
            {book.cover_image ? (
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-16 w-16 text-primary/30" />
              </div>
            )}
          </div>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
              {book.genre}
            </Badge>
            <Badge
              variant="outline"
              className={
                book.available_copies > 0
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                  : 'border-muted bg-muted text-muted-foreground'
              }
            >
              {book.available_copies > 0
                ? `${book.available_copies} of ${book.total_copies} available`
                : 'Unavailable'}
            </Badge>
          </div>

          {book.description && (
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          )}

          <Separator />

          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-4 text-sm">
              <div>
                <p className="font-medium text-foreground">ISBN</p>
                <p className="text-muted-foreground">{book.isbn}</p>
              </div>
              {book.publisher && (
                <div>
                  <p className="font-medium text-foreground">Publisher</p>
                  <p className="text-muted-foreground">{book.publisher}</p>
                </div>
              )}
              {book.published_year && (
                <div>
                  <p className="font-medium text-foreground">Published Year</p>
                  <p className="text-muted-foreground">{book.published_year}</p>
                </div>
              )}
              {book.page_count && (
                <div>
                  <p className="font-medium text-foreground">Pages</p>
                  <p className="text-muted-foreground">{book.page_count}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {book.available_copies > 0 && profile && (
              <Button onClick={() => setCheckoutOpen(true)} className="shadow-sm shadow-primary/25">
                Borrow this book
              </Button>
            )}
            {isAdmin && (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/books/${book.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteBook.isPending}
                >
                  {deleteBook.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <CheckoutDialog
        book={book}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onConfirm={confirmCheckout}
        loading={checkout.isPending}
      />
    </div>
  )
}
