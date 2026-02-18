'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBooks } from '@/hooks/use-books'
import { useCheckout } from '@/hooks/use-borrow'
import { useUser } from '@/hooks/use-user'
import { PageHeader } from '@/components/layout/page-header'
import { BookList } from '@/components/books/book-list'
import { BookSearch } from '@/components/books/book-search'
import { BookFiltersComponent } from '@/components/books/book-filters'
import { NLPSearchBar } from '@/components/ai/nlp-search-bar'
import { CheckoutDialog } from '@/components/borrow/checkout-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Book, BookFilters } from '@/types'

export default function BooksPage() {
  const [filters, setFilters] = useState<BookFilters>({ page: 1, limit: 12 })
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const { data, isLoading } = useBooks(filters)
  const checkout = useCheckout()
  const { profile } = useUser()

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }))
  }

  const handleAISearch = (newFilters: BookFilters) => {
    // When the AI extracts structured filters (genre, author, available),
    // drop the raw "search" text to avoid AND conflicts
    // (e.g. search="scifi" AND genre="Science Fiction" matches nothing)
    const hasStructuredFilters = newFilters.genre || newFilters.author || newFilters.available != null
    const cleanFilters = { ...newFilters }
    if (hasStructuredFilters) {
      delete cleanFilters.search
    }
    // Clear any null/undefined values so they don't get sent as "null" strings
    const sanitized: BookFilters = { page: 1, limit: 12 }
    for (const [key, value] of Object.entries(cleanFilters)) {
      if (value != null && value !== 'null') {
        (sanitized as Record<string, unknown>)[key] = value
      }
    }
    setFilters(sanitized)
  }

  const handleCheckout = (book: Book) => {
    setSelectedBook(book)
    setCheckoutOpen(true)
  }

  const confirmCheckout = async () => {
    if (!selectedBook || !profile) return
    try {
      await checkout.mutateAsync({
        bookId: selectedBook.id,
        userId: profile.id,
      })
      toast.success(`"${selectedBook.title}" checked out successfully!`)
      setCheckoutOpen(false)
      setSelectedBook(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Books" description="Browse and manage the library catalog.">
        {profile?.role === 'admin' || profile?.role === 'librarian' ? (
          <Button asChild>
            <Link href="/books/new">
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Link>
          </Button>
        ) : null}
      </PageHeader>

      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard">Standard Search</TabsTrigger>
          <TabsTrigger value="ai">AI Search</TabsTrigger>
        </TabsList>
        <TabsContent value="standard" className="space-y-4">
          <BookSearch onSearch={handleSearch} />
          <BookFiltersComponent filters={filters} onChange={setFilters} />
        </TabsContent>
        <TabsContent value="ai">
          <NLPSearchBar onSearch={handleAISearch} />
        </TabsContent>
      </Tabs>

      <BookList
        books={data?.data || []}
        loading={isLoading}
        onCheckout={handleCheckout}
      />

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {filters.page || 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={(filters.page || 1) >= data.totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      <CheckoutDialog
        book={selectedBook}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onConfirm={confirmCheckout}
        loading={checkout.isPending}
      />
    </div>
  )
}
