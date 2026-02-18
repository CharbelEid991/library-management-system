import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { toSnakeCase } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const book = await prisma.book.findUnique({
      where: { id },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(toSnakeCase(book))
  } catch (error) {
    console.error('Failed to fetch book:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingBook = await prisma.book.findUnique({
      where: { id },
    })

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: body.title ?? existingBook.title,
        author: body.author ?? existingBook.author,
        isbn: body.isbn ?? existingBook.isbn,
        description: body.description ?? existingBook.description,
        coverImage: (body.coverImage ?? body.cover_image) ?? existingBook.coverImage,
        genre: body.genre ?? existingBook.genre,
        publisher: body.publisher ?? existingBook.publisher,
        publishedYear: (body.publishedYear ?? body.published_year) ?? existingBook.publishedYear,
        pageCount: (body.pageCount ?? body.page_count) ?? existingBook.pageCount,
        totalCopies: (body.totalCopies ?? body.total_copies) ?? existingBook.totalCopies,
        availableCopies: (body.availableCopies ?? body.available_copies) ?? existingBook.availableCopies,
      },
    })

    return NextResponse.json(toSnakeCase(book))
  } catch (error) {
    console.error('Failed to update book:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingBook = await prisma.book.findUnique({
      where: { id },
    })

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    await prisma.book.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Failed to delete book:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
