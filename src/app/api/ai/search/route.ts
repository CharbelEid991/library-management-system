import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseNaturalLanguageSearch } from '@/lib/ai'
import { toSnakeCase } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      )
    }

    const filters = await parseNaturalLanguageSearch(query)

    const where: Record<string, unknown> = {}
    const hasStructuredFilters = filters.genre || filters.author || filters.available != null

    // Only use "search" for text matching if the AI didn't extract
    // more specific structured filters — otherwise it's redundant
    // and causes AND conflicts (e.g. search="Science fiction" AND genre="Science Fiction")
    if (filters.search && !hasStructuredFilters) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { author: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.author) {
      where.author = { contains: filters.author, mode: 'insensitive' }
    }

    // Case-insensitive genre match
    if (filters.genre) {
      where.genre = { equals: filters.genre, mode: 'insensitive' }
    }

    if (filters.available === true) {
      where.availableCopies = { gt: 0 }
    }

    let orderBy: Record<string, string> = { title: 'asc' }
    if (filters.sort === 'year') {
      orderBy = { publishedYear: 'desc' }
    } else if (filters.sort === 'newest') {
      orderBy = { createdAt: 'desc' }
    } else if (filters.sort === 'author') {
      orderBy = { author: 'asc' }
    }

    const books = await prisma.book.findMany({
      where,
      orderBy,
      take: 20,
    })

    return NextResponse.json({
      query,
      interpretedQuery: filters.interpretedQuery || query,
      filters: {
        search: filters.search,
        genre: filters.genre,
        available: filters.available,
        author: filters.author,
        sort: filters.sort,
      },
      results: toSnakeCase(books),
    })
  } catch (error) {
    console.error('Failed to perform AI search:', error)
    return NextResponse.json(
      { error: 'Failed to perform AI search' },
      { status: 500 }
    )
  }
}
