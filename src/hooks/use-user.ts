'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as AuthUser } from '@supabase/supabase-js'
import type { User } from '@/types'

/**
 * Build a fallback profile from the Supabase auth user metadata.
 * This ensures the UI works even if the server profile hasn't loaded yet.
 */
function profileFromAuth(user: AuthUser): User {
  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || user.email || '',
    role: 'member',
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  }
}

export function useUser() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    const supabase = supabaseRef.current

    async function fetchOrCreateProfile(user: AuthUser): Promise<User | null> {
      // Try fetching the existing profile
      for (let i = 0; i < 3; i++) {
        try {
          const res = await fetch('/api/users/me')
          if (res.ok) {
            return await res.json()
          }
          if (res.status === 401 && i < 2) {
            await new Promise((r) => setTimeout(r, 500))
            continue
          }
        } catch {
          if (i < 2) {
            await new Promise((r) => setTimeout(r, 500))
            continue
          }
        }
      }

      // /api/users/me failed — try creating via register endpoint as fallback
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email,
          }),
        })
        if (res.ok) {
          return await res.json()
        }
      } catch {
        // Both paths failed
      }

      return null
    }

    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setAuthUser(user)

        if (user) {
          // Set fallback profile immediately so UI never shows "Sign in"
          setProfile(profileFromAuth(user))

          // Then fetch/create the real profile with role info
          const serverProfile = await fetchOrCreateProfile(user)
          if (serverProfile) {
            setProfile(serverProfile)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null
        setAuthUser(user)

        if (user) {
          setProfile(profileFromAuth(user))
          const serverProfile = await fetchOrCreateProfile(user)
          if (serverProfile) {
            setProfile(serverProfile)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = supabaseRef.current
    await supabase.auth.signOut()
    setAuthUser(null)
    setProfile(null)
    window.location.href = '/login'
  }

  return { authUser, profile, loading, signOut }
}
