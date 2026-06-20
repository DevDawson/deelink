'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={`
        w-9 h-9 rounded-xl flex items-center justify-center transition-all
        border border-[var(--border)] hover:border-violet-500/40
        text-[var(--muted)] hover:text-violet-500
        bg-[var(--glass-bg)] hover:bg-violet-500/10
        ${className}
      `}
    >
      {theme === 'dark'
        ? <Sun  size={16} />
        : <Moon size={16} />}
    </button>
  )
}
