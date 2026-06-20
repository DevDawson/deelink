'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface Props {
  url: string
  title: string
  style?: React.CSSProperties
}

export default function ShareButton({ url, title, style }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {}
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      style={style}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border opacity-50 hover:opacity-80 transition-opacity"
    >
      {copied ? (
        <>
          <Check size={11} />
          Copied!
        </>
      ) : (
        <>
          <Share2 size={11} />
          Share
        </>
      )}
    </button>
  )
}
