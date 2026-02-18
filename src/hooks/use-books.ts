'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Book, BookFilters, PaginatedResponse } from '@/types'

async function fetchBooks(filters: BookFilters): Promise<PaginatedResponse<Book>> {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.genre) params.set('genre', filters.genre)
  if (filters.available !== undefined) params.set('available', String(filters.available))
  if (filters.author) params.set('author', filters.author)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const res = await fetch(`/api/books?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch books')
  return res.json()
}

async function fetchBook(id: string): Promise<Book> {
  const res = await fetch(`/api/books/${id}`)
  if (!res.ok) throw new Error('Failed to fetch book')
  return res.json()
}

async function createBook(book: Partial<Book>): Promise<Book> {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
  if (!res.ok) throw new Error('Failed to create book')
  return res.json()
}

async function updateBook({ id, ...data }: Partial<Book> & { id: string }): Promise<Book> {
  const res = await fetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update book')
  return res.json()
}

async function deleteBook(id: string): Promise<void> {
  const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete book')
}

export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => fetchBooks(filters),
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => fetchBook(id),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['book', data.id] })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
