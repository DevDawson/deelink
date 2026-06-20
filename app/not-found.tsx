import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--background)' }}>

      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-400/10 dark:bg-violet-700/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-fuchsia-400/10 dark:bg-fuchsia-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative text-center">
        <p className="text-[120px] font-black leading-none bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text text-transparent select-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Page not found</h1>
        <p className="text-[var(--muted)] text-sm mt-2 max-w-xs mx-auto">
          This page doesn&apos;t exist or the artist profile you&apos;re looking for hasn&apos;t been created yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 text-sm font-medium
            text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white
            border border-[var(--border)] hover:border-violet-400/40
            bg-[var(--glass-bg)] hover:bg-violet-50 dark:hover:bg-white/5
            rounded-xl px-5 py-2.5 transition-all"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  )
}
