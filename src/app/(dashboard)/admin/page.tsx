'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/use-user'
import { useBooks } from '@/hooks/use-books'
import { useBorrowRecords } from '@/hooks/use-borrow'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, Users, BookOpen, ArrowLeftRight } from 'lucide-react'
import type { User } from '@/types'

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case 'admin':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-700'
    case 'librarian':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
    default:
      return 'border-muted bg-muted text-muted-foreground'
  }
}

export default function AdminPage() {
  const { profile } = useUser()
  const { data: booksData } = useBooks({})
  const { data: borrowRecords } = useBorrowRecords()
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        }
      } catch {
        // Failed silently
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-4">
          <Shield className="h-8 w-8 text-destructive/50" />
        </div>
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You need admin privileges to access this page.
        </p>
      </div>
    )
  }

  const activeCheckouts = borrowRecords?.filter((r) => r.status === 'checked_out').length || 0

  const statCards = [
    {
      title: 'Total Users',
      icon: Users,
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600',
      value: users.length,
    },
    {
      title: 'Total Books',
      icon: BookOpen,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      value: booksData?.total || 0,
    },
    {
      title: 'Active Checkouts',
      icon: ArrowLeftRight,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      value: activeCheckouts,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        description="Manage users, books, and system settings."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md hover:border-primary/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">
                        {user.full_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeStyle(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
