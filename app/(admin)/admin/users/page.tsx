'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// /admin/users redirects to /admin where the user table lives
export default function AdminUsersRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin') }, [router])
  return null
}
