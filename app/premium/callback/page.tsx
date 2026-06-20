'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { subscribeApi, artistApi } from '@/lib/api'
import { CheckCircle, Clock, Loader, XCircle } from 'lucide-react'
import Link from 'next/link'

type Status = 'loading' | 'active' | 'processing' | 'failed' | 'no_tracking'

const POLL_INTERVAL_MS = 3000
const MAX_POLLS        = 10  // 30 seconds total before showing "processing" state

function CallbackInner() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const { updateArtist } = useAuthStore()

  const [status, setStatus] = useState<Status>('loading')
  const pollCountRef        = useRef(0)
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pesapal appends OrderTrackingId to the callback_url
  const trackingId = searchParams.get('OrderTrackingId')

  const refreshProfile = async () => {
    try {
      const res = await artistApi.getProfile()
      updateArtist(res.data.data)
    } catch {
      // Non-fatal — UI will show correct plan on next dashboard load
    }
  }

  const poll = async () => {
    if (!trackingId) {
      setStatus('no_tracking')
      return
    }

    try {
      const res  = await subscribeApi.status(trackingId)
      const data = res.data

      if (data.status === 'active') {
        await refreshProfile()
        setStatus('active')
        return
      }

      if (data.status === 'failed' || data.status === 'cancelled') {
        setStatus('failed')
        return
      }

      // pending — keep polling
      pollCountRef.current += 1

      if (pollCountRef.current >= MAX_POLLS) {
        setStatus('processing')
        return
      }

      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
    } catch {
      pollCountRef.current += 1

      if (pollCountRef.current >= MAX_POLLS) {
        setStatus('processing')
        return
      }

      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
    }
  }

  useEffect(() => {
    // Start polling — small initial delay to allow IPN to arrive
    timerRef.current = setTimeout(poll, 1500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-redirect to dashboard after successful payment
  useEffect(() => {
    if (status === 'active') {
      const t = setTimeout(() => router.push('/dashboard'), 4000)
      return () => clearTimeout(t)
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-700/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative glass rounded-2xl p-10 max-w-sm w-full text-center">

        {/* Loading / polling */}
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader size={32} className="text-violet-400 animate-spin" />
            </div>
            <h2 className="text-white font-bold text-lg">Inathibitisha malipo…</h2>
            <p className="text-slate-500 text-sm mt-1">Tafadhali subiri huku tunakagua hali ya malipo yako.</p>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </>
        )}

        {/* Success */}
        {status === 'active' && (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-emerald-400" />
            </div>
            <h2 className="text-white font-black text-xl">Hongera! 🎉</h2>
            <p className="text-amber-400 font-semibold text-sm mt-1">Premium imewashwa</p>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Akaunti yako imeboreshwa. Unaelekezwa kwenye dashibodi…
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Nenda Dashibodi
            </Link>
          </>
        )}

        {/* Still processing (IPN delayed) */}
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={36} className="text-amber-400" />
            </div>
            <h2 className="text-white font-bold text-xl">Malipo yanashughulikiwa</h2>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Malipo yako yamepokewa na yanashughulikiwa. Akaunti yako itaboreshwa moja kwa moja
              ndani ya dakika chache. Unaweza kuendelea kutumia deeLink.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/12 text-slate-300 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Rudi Dashibodi
            </Link>
          </>
        )}

        {/* Failed */}
        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-red-400" />
            </div>
            <h2 className="text-white font-bold text-xl">Malipo hayakufanikiwa</h2>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Malipo hayakukamilika. Hujachajiwa. Tafadhali jaribu tena.
            </p>
            <Link
              href="/dashboard/premium"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              Jaribu Tena
            </Link>
          </>
        )}

        {/* No tracking ID — accessed directly */}
        {status === 'no_tracking' && (
          <>
            <div className="w-16 h-16 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-slate-500" />
            </div>
            <h2 className="text-white font-bold text-xl">Ukurasa huu hauwezi kufunguliwa moja kwa moja</h2>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Ukurasa huu unafunguliwa baada ya kukamilisha malipo.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-white/10 text-slate-300 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Rudi Dashibodi
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PremiumCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050508] flex items-center justify-center">
          <Loader size={32} className="text-violet-400 animate-spin" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  )
}
