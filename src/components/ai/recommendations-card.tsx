'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, Loader2, BookOpen } from 'lucide-react'
import type { AIRecommendation } from '@/types'

export function RecommendationsCard() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/recommend', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setRecommendations(data)
      }
    } catch {
      // Failed silently
    } finally {
      setLoading(false)
      setFetched(true)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-primary/20 to-violet-500/20 p-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">AI Recommendations</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRecommendations}
            disabled={loading}
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {fetched ? 'Refresh' : 'Get Recommendations'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border hover:border-primary/20 hover:bg-primary/5 transition-colors">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{rec.title}</p>
                    <Badge variant="outline" className="text-xs border-primary/30 bg-primary/5 text-primary">
                      {Math.round(rec.matchScore * 100)}% match
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">by {rec.author}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        ) : fetched ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
              <BookOpen className="h-6 w-6 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              No recommendations available. Borrow some books first!
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 mb-3">
              <Sparkles className="h-6 w-6 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Click the button to get personalized book recommendations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
