'use client'

import { useRouter } from 'next/navigation'
import { useCreateBook } from '@/hooks/use-books'
import { PageHeader } from '@/components/layout/page-header'
import { BookForm } from '@/components/books/book-form'
import { toast } from 'sonner'
import type { Book } from '@/types'

export default function NewBookPage() {
  const createBook = useCreateBook()
  const router = useRouter()

  const handleSubmit = async (data: Partial<Book>) => {
    try {
      await createBook.mutateAsync(data)
      toast.success('Book added successfully!')
      router.push('/books')
    } catch {
      toast.error('Failed to add book')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Add New Book"
        description="Add a new book to the library catalog."
      />
      <BookForm onSubmit={handleSubmit} loading={createBook.isPending} />
    </div>
  )
}
