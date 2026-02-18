'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { BookFilters } from '@/types'

const genres = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Romance',
  'Mystery', 'Thriller', 'Horror', 'Biography', 'History',
  'Science', 'Technology', 'Self-Help', 'Philosophy', 'Poetry',
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'author', label: 'Author A-Z' },
  { value: 'year', label: 'Year Published' },
]

interface BookFiltersProps {
  filters: BookFilters
  onChange: (filters: BookFilters) => void
}

export function BookFiltersComponent({ filters, onChange }: BookFiltersProps) {
  const hasFilters = filters.genre || filters.available !== undefined || filters.sort

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.genre || ''}
        onValueChange={(value) => onChange({ ...filters, genre: value || undefined })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.available === undefined ? '' : String(filters.available)}
        onValueChange={(value) =>
          onChange({ ...filters, available: value === '' ? undefined : value === 'true' })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Available</SelectItem>
          <SelectItem value="false">Checked Out</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sort || ''}
        onValueChange={(value) =>
          onChange({ ...filters, sort: (value || undefined) as BookFilters['sort'] })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ search: filters.search })}
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
