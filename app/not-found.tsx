import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-700/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-fuchsia-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative text-center">
        <p className="text-[120px] font-black leading-none bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent select-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mt-2">Page not found</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
          This page doesn&apos;t exist or the artist profile you&apos;re looking for hasn&apos;t been created yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl px-5 py-2.5 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  )
}
