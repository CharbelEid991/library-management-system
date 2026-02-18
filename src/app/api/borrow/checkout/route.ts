import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { toSnakeCase } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bookId, userId } = body

    if (!bookId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, userId' },
        { status: 400 }
      )
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.availableCopies <= 0) {
      return NextResponse.json(
        { error: 'No available copies of this book' },
        { status: 400 }
      )
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    const [borrowRecord] = await prisma.$transaction([
      prisma.borrowRecord.create({
        data: {
          userId,
          bookId,
          checkedOutAt: new Date(),
          dueDate,
          status: 'checked_out',
        },
        include: {
          user: true,
          book: true,
        },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      }),
    ])

    return NextResponse.json(toSnakeCase(borrowRecord), { status: 201 })
  } catch (error) {
    console.error('Failed to checkout book:', error)
    return NextResponse.json(
      { error: 'Failed to checkout book' },
      { status: 500 }
    )
  }
}
