// store/auth.ts
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

export type AuthState = {
  session: Session | null
  user: User | null
  loading: boolean
  setSession: (session: Session | null) => void
  initSession: () => Promise<void>
}

let hasAuthListener = false

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })
  },

  initSession: async () => {
    // 1. Load current session on app start
    const { data: { session } } = await supabase.auth.getSession()
    console.log("authh",session)
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })



    // 2. Listen for auth changes
    if (!hasAuthListener) {
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
        })
      })
      hasAuthListener = true
    }
  },
}))
