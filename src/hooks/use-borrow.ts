'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { BorrowRecord } from '@/types'

async function fetchBorrowRecords(): Promise<BorrowRecord[]> {
  const res = await fetch('/api/borrow')
  if (!res.ok) throw new Error('Failed to fetch borrow records')
  return res.json()
}

async function checkoutBook(data: { bookId: string; userId: string }): Promise<BorrowRecord> {
  const res = await fetch('/api/borrow/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to checkout book')
  }
  return res.json()
}

async function checkinBook(borrowId: string): Promise<BorrowRecord> {
  const res = await fetch('/api/borrow/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ borrowId }),
  })
  if (!res.ok) throw new Error('Failed to check in book')
  return res.json()
}

export function useBorrowRecords() {
  return useQuery({
    queryKey: ['borrow-records'],
    queryFn: fetchBorrowRecords,
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: checkoutBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrow-records'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export function useCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: checkinBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrow-records'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
