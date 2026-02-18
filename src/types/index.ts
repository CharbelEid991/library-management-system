export type UserRole = 'admin' | 'librarian' | 'member'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  description?: string
  cover_image?: string
  genre: string
  publisher?: string
  published_year?: number
  page_count?: number
  total_copies: number
  available_copies: number
  created_at: string
  updated_at: string
}

export type BorrowStatus = 'checked_out' | 'returned' | 'overdue'

export interface BorrowRecord {
  id: string
  user_id: string
  book_id: string
  checked_out_at: string
  due_date: string
  returned_at?: string
  status: BorrowStatus
  user?: User
  book?: Book
}

export interface BookFilters {
  search?: string
  genre?: string
  available?: boolean
  author?: string
  sort?: 'title' | 'author' | 'year' | 'newest'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AIRecommendation {
  title: string
  author: string
  reason: string
  matchScore: number
}

export interface AISearchResult {
  query: string
  interpretedQuery: string
  filters: BookFilters
  results: Book[]
}

export interface AIAutofillResult {
  title: string
  author: string
  isbn: string
  description: string
  genre: string
  publisher: string
  published_year: number
  page_count: number
}
