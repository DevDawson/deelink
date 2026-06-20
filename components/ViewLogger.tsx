'use client'

import { useEffect } from 'react'
import { publicApi } from '@/lib/api'

export default function ViewLogger({ username }: { username: string }) {
  useEffect(() => {
    publicApi.logView(username).catch(() => {})
  }, [username])

  return null
}
