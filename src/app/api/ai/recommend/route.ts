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

    const recommendations = await getBookRecommendations(
      borrowHistory,
      availableBooks
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
