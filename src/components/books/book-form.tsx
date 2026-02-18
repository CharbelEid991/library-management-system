'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import type { Book } from '@/types'

const genres = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Romance',
  'Mystery', 'Thriller', 'Horror', 'Biography', 'History',
  'Science', 'Technology', 'Self-Help', 'Philosophy', 'Poetry',
  'Children', 'Young Adult', 'Comics', 'Art', 'Cooking',
]

interface BookFormProps {
  book?: Partial<Book>
  onSubmit: (data: Partial<Book>) => void
  loading?: boolean
}

export function BookForm({ book, onSubmit, loading }: BookFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    description: book?.description || '',
    genre: book?.genre || '',
    publisher: book?.publisher || '',
    published_year: book?.published_year || undefined,
    page_count: book?.page_count || undefined,
    total_copies: book?.total_copies || 1,
    available_copies: book?.available_copies || 1,
    cover_image: book?.cover_image || '',
  })
  const [autofilling, setAutofilling] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAutofill = async () => {
    if (!formData.title && !formData.isbn) return
    setAutofilling(true)
    try {
      const res = await fetch('/api/ai/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: formData.title || formData.isbn }),
      })
      if (res.ok) {
        const data = await res.json()
        setFormData((prev) => ({
          ...prev,
          title: data.title || prev.title,
          author: data.author || prev.author,
          isbn: data.isbn || prev.isbn,
          description: data.description || prev.description,
          genre: data.genre || prev.genre,
          publisher: data.publisher || prev.publisher,
          published_year: data.published_year || prev.published_year,
          page_count: data.page_count || prev.page_count,
        }))
      }
    } catch {
      // Autofill failed silently
    } finally {
      setAutofilling(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{book?.id ? 'Edit Book' : 'Add New Book'}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutofill}
            disabled={autofilling || (!formData.title && !formData.isbn)}
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            {autofilling ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
            )}
            AI Autofill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => handleChange('genre', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => handleChange('publisher', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="published_year">Published Year</Label>
              <Input
                id="published_year"
                type="number"
                value={formData.published_year || ''}
                onChange={(e) => handleChange('published_year', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page_count">Page Count</Label>
              <Input
                id="page_count"
                type="number"
                value={formData.page_count || ''}
                onChange={(e) => handleChange('page_count', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_copies">Total Copies</Label>
              <Input
                id="total_copies"
                type="number"
                min={1}
                value={formData.total_copies || 1}
                onChange={(e) => handleChange('total_copies', parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => handleChange('cover_image', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading} className="shadow-sm shadow-primary/25">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {book?.id ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
