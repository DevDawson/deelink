'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Artist } from '@/lib/types'

interface AuthState {
  token: string | null
  user: User | null
  artist: Artist | null
  isAdmin: boolean
  isLoading: boolean
  setAuth: (token: string, user: User, artist: Artist | null) => void
  updateArtist: (artist: Partial<Artist>) => void
  clearAuth: () => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      artist: null,
      isAdmin: false,
      isLoading: false,
      setAuth: (token, user, artist) =>
        set({ token, user, artist, isAdmin: user.role === 'admin' }),
      updateArtist: (partial) =>
        set((s) => ({ artist: s.artist ? { ...s.artist, ...partial } : s.artist })),
      clearAuth: () => set({ token: null, user: null, artist: null, isAdmin: false }),
      setLoading: (v) => set({ isLoading: v }),
    }),
    { name: 'deelink-auth' }
  )
)
