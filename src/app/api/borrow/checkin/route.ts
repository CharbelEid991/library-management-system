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
    const { borrowId } = body

    if (!borrowId) {
      return NextResponse.json(
        { error: 'Missing required field: borrowId' },
        { status: 400 }
      )
    }

    const borrowRecord = await prisma.borrowRecord.findUnique({
      where: { id: borrowId },
    })

    if (!borrowRecord) {
      return NextResponse.json(
        { error: 'Borrow record not found' },
        { status: 404 }
      )
    }

    if (borrowRecord.status === 'returned') {
      return NextResponse.json(
        { error: 'This book has already been returned' },
        { status: 400 }
      )
    }

    const [updatedRecord] = await prisma.$transaction([
      prisma.borrowRecord.update({
        where: { id: borrowId },
        data: {
          status: 'returned',
          returnedAt: new Date(),
        },
        include: {
          user: true,
          book: true,
        },
      }),
      prisma.book.update({
        where: { id: borrowRecord.bookId },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      }),
    ])

    return NextResponse.json(toSnakeCase(updatedRecord))
  } catch (error) {
    console.error('Failed to checkin book:', error)
    return NextResponse.json(
      { error: 'Failed to checkin book' },
      { status: 500 }
    )
  }
}
