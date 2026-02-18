import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { toSnakeCase } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const borrowRecords = await prisma.borrowRecord.findMany({
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        checkedOutAt: 'desc',
      },
    })

    return NextResponse.json(toSnakeCase(borrowRecords))
  } catch (error) {
    console.error('Failed to fetch borrow records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch borrow records' },
      { status: 500 }
    )
  }
}
