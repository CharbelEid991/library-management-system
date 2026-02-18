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

    let profile = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!profile) {
      // Auto-create the profile if it doesn't exist yet
      // (handles cases where /api/auth/register was skipped or failed)
      try {
        profile = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            fullName: user.user_metadata?.full_name || user.email!,
            role: 'member',
            avatarUrl: user.user_metadata?.avatar_url || null,
          },
        })
      } catch (createError) {
        // Could be a unique constraint race condition — try finding again
        profile = await prisma.user.findUnique({
          where: { id: user.id },
        })
        if (!profile) {
          console.error('Failed to create user profile:', createError)
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json(toSnakeCase(profile))
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
