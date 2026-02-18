import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { toSnakeCase } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''
    const available = searchParams.get('available')
    const author = searchParams.get('author') || ''
    const sort = searchParams.get('sort') || 'title'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (genre) {
      where.genre = { equals: genre, mode: 'insensitive' }
    }

    if (author) {
      where.author = { contains: author, mode: 'insensitive' }
    }

    if (available === 'true') {
      where.availableCopies = { gt: 0 }
    }

    let orderBy: Record<string, string> = { title: 'asc' }
    switch (sort) {
      case 'title':
        orderBy = { title: 'asc' }
        break
      case 'author':
        orderBy = { author: 'asc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'publishedYear':
        orderBy = { publishedYear: 'desc' }
        break
      default:
        orderBy = { title: 'asc' }
    }

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
    ])

    return NextResponse.json({
      data: toSnakeCase(data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Failed to fetch books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, isbn, genre, description, coverImage, cover_image, publisher, publishedYear, published_year, pageCount, page_count, totalCopies, total_copies } = body

    if (!title || !author || !isbn || !genre) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, isbn, genre' },
        { status: 400 }
      )
    }

    const existingBook = await prisma.book.findFirst({
      where: { isbn },
    })

    if (existingBook) {
      return NextResponse.json(
        { error: 'A book with this ISBN already exists' },
        { status: 409 }
      )
    }

    const copies = totalCopies || total_copies || 1

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        genre,
        description: description || null,
        coverImage: coverImage || cover_image || null,
        publisher: publisher || null,
        publishedYear: publishedYear || published_year || null,
        pageCount: pageCount || page_count || null,
        totalCopies: copies,
        availableCopies: copies,
      },
    })

    return NextResponse.json(toSnakeCase(book), { status: 201 })
  } catch (error) {
    console.error('Failed to create book:', error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
