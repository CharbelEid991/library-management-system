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

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: admin access required' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(toSnakeCase(users))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
