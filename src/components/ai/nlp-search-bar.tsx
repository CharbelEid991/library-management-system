'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, Search } from 'lucide-react'
import type { BookFilters } from '@/types'

interface NLPSearchBarProps {
  onSearch: (filters: BookFilters, interpretedQuery: string) => void
}

export function NLPSearchBar({ onSearch }: NLPSearchBarProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [interpretation, setInterpretation] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (res.ok) {
        const data = await res.json()
        setInterpretation(data.interpretedQuery)
        onSearch(data.filters, data.interpretedQuery)
      }
    } catch {
      // Fallback to regular search
      onSearch({ search: query }, query)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'sci-fi books published after 2000' or 'available fantasy novels'"
            className="pl-9 border-primary/20 focus-visible:ring-primary/30"
          />
        </div>
        <Button type="submit" disabled={loading} className="shadow-sm">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          AI Search
        </Button>
      </form>
      {interpretation && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            {interpretation}
          </Badge>
        </div>
      )}
    </div>
  )
}
