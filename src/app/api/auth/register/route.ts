import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/db'
import { toSnakeCase } from '@/lib/utils'

/**
 * POST /api/auth/register
 * Creates a user profile in the database after Supabase Auth signup.
 * Uses the service role key to verify the user exists in Supabase Auth,
 * bypassing cookie-based auth which may not be synced yet.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, fullName } = body

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email' },
        { status: 400 }
      )
    }

    // Verify the user actually exists in Supabase Auth using the service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not found in auth system' },
        { status: 404 }
      )
    }

    // Check if profile already exists
    let profile = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!profile) {
      profile = await prisma.user.create({
        data: {
          id: userId,
          email: user.email || email,
          fullName: fullName || user.user_metadata?.full_name || email,
          role: 'member',
          avatarUrl: user.user_metadata?.avatar_url || null,
        },
      })
    }

    return NextResponse.json(toSnakeCase(profile), { status: 201 })
  } catch (error) {
    console.error('Failed to register user:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
