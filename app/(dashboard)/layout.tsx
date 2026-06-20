'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import DashboardNav from '@/components/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.replace('/login')
  }, [token, router])

  if (!token) return null

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <DashboardNav />
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
