'use client'

import { useState } from 'react'
import { useBorrowRecords, useCheckin } from '@/hooks/use-borrow'
import { PageHeader } from '@/components/layout/page-header'
import { BorrowTable } from '@/components/borrow/borrow-table'
import { CheckinDialog } from '@/components/borrow/checkin-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import type { BorrowRecord } from '@/types'

export default function BorrowPage() {
  const { data: records, isLoading } = useBorrowRecords()
  const checkin = useCheckin()
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null)
  const [checkinOpen, setCheckinOpen] = useState(false)

  const activeRecords = records?.filter((r) => r.status === 'checked_out') || []
  const returnedRecords = records?.filter((r) => r.status === 'returned') || []

  const handleCheckin = (record: BorrowRecord) => {
    setSelectedRecord(record)
    setCheckinOpen(true)
  }

  const confirmCheckin = async () => {
    if (!selectedRecord) return
    try {
      await checkin.mutateAsync(selectedRecord.id)
      toast.success('Book returned successfully!')
      setCheckinOpen(false)
      setSelectedRecord(null)
    } catch {
      toast.error('Failed to return book')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Borrowing"
        description="Track book checkouts and returns."
      />

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeRecords.length})
          </TabsTrigger>
          <TabsTrigger value="returned">
            Returned ({returnedRecords.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({records?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <BorrowTable
            records={activeRecords}
            loading={isLoading}
            onCheckin={handleCheckin}
          />
        </TabsContent>

        <TabsContent value="returned">
          <BorrowTable records={returnedRecords} loading={isLoading} />
        </TabsContent>

        <TabsContent value="all">
          <BorrowTable
            records={records || []}
            loading={isLoading}
            onCheckin={handleCheckin}
          />
        </TabsContent>
      </Tabs>

      <CheckinDialog
        record={selectedRecord}
        open={checkinOpen}
        onOpenChange={setCheckinOpen}
        onConfirm={confirmCheckin}
        loading={checkin.isPending}
      />
    </div>
  )
}
