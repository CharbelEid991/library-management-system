'use client'

import { useUser } from '@/hooks/use-user'
import { useBooks } from '@/hooks/use-books'
import { useBorrowRecords } from '@/hooks/use-borrow'
import { PageHeader } from '@/components/layout/page-header'
import { RecommendationsCard } from '@/components/ai/recommendations-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, ArrowLeftRight, AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function DashboardPage() {
  const { profile } = useUser()
  const { data: booksData, isLoading: booksLoading } = useBooks({ limit: 4 })
  const { data: borrowRecords, isLoading: borrowLoading } = useBorrowRecords()

  const activeCheckouts = borrowRecords?.filter((r) => r.status === 'checked_out') || []
  const overdueBooks = activeCheckouts.filter((r) => new Date(r.due_date) < new Date())

  const statCards = [
    {
      title: 'Total Books',
      icon: BookOpen,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      value: booksData?.total || 0,
      loading: booksLoading,
    },
    {
      title: 'Active Checkouts',
      icon: ArrowLeftRight,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      value: activeCheckouts.length,
      loading: borrowLoading,
    },
    {
      title: 'Overdue',
      icon: AlertTriangle,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-600',
      value: overdueBooks.length,
      loading: borrowLoading,
      valueColor: 'text-destructive',
    },
    {
      title: 'Members',
      icon: Users,
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600',
      value: '-',
      loading: false,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${profile?.full_name ? `, ${profile.full_name}` : ''}`}
        description="Here's an overview of your library."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md hover:border-primary/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className={`text-2xl font-bold ${stat.valueColor || ''}`}>
                  {stat.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Books</CardTitle>
          </CardHeader>
          <CardContent>
            {booksLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {booksData?.data.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-primary/5 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      book.available_copies > 0
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {book.available_copies}/{book.total_copies} avail.
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <RecommendationsCard />
      </div>
    </div>
  )
}
