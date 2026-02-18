import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getBookRecommendations } from '@/lib/ai'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const borrowHistory = await prisma.borrowRecord.findMany({
      where: { userId: user.id },
      include: {
        book: true,
      },
      orderBy: {
        checkedOutAt: 'desc',
      },
    })

    const availableBooks = await prisma.book.findMany({
      where: {
        availableCopies: { gt: 0 },
      },
    })

    // Transform borrowHistory to match expected format
    const userHistory = borrowHistory.map((record) => ({
      title: record.book.title,
      author: record.book.author,
      genre: record.book.genre,
    }))

    // Transform availableBooks to match expected format
    const booksForRecommendation = availableBooks.map((book) => ({
      title: book.title,
      author: book.author,
      genre: book.genre,
    }))

    const recommendations = await getBookRecommendations(
      userHistory,
      booksForRecommendation
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Failed to get recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}
