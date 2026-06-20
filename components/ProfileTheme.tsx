'use client'

import { Theme, Plan } from '@/lib/types'
import { Lock } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  theme: Theme
  onChange: (theme: Theme) => void
  plan: Plan
}

const PLAN_ORDER: Plan[] = ['free', 'starter', 'pro', 'silver']

function isUnlocked(required: Plan, userPlan: Plan) {
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(required)
}

const THEMES: { label: string; emoji: string; minPlan: Plan; theme: Theme }[] = [
  {
    label: 'Midnight',  emoji: '🌑', minPlan: 'free',
    theme: { bg_color: '#0a0a0f', text_color: '#e2e8f0', button_style: 'rounded', button_color: '#1e1e2e' },
  },
  {
    label: 'White',     emoji: '☁️', minPlan: 'free',
    theme: { bg_color: '#f8fafc', text_color: '#0f172a', button_style: 'rounded', button_color: '#f1f5f9' },
  },
  {
    label: 'Violet',    emoji: '💜', minPlan: 'starter',
    theme: { bg_color: '#13002e', text_color: '#ede9fe', button_style: 'pill', button_color: '#7c3aed' },
  },
  {
    label: 'Aurora',    emoji: '🌌', minPlan: 'starter',
    theme: { bg_color: '#0d1117', text_color: '#c9d1d9', button_style: 'rounded', button_color: '#238636' },
  },
  {
    label: 'Ocean',     emoji: '🌊', minPlan: 'pro',
    theme: { bg_color: '#030d1a', text_color: '#bae6fd', button_style: 'rounded', button_color: '#0369a1' },
  },
  {
    label: 'Sunset',    emoji: '🌅', minPlan: 'pro',
    theme: { bg_color: '#1a0505', text_color: '#fed7aa', button_style: 'pill', button_color: '#dc2626' },
  },
  {
    label: 'Gold',      emoji: '✨', minPlan: 'pro',
    theme: { bg_color: '#0f0900', text_color: '#fef3c7', button_style: 'sharp', button_color: '#d97706' },
  },
  {
    label: 'Forest',    emoji: '🌿', minPlan: 'pro',
    theme: { bg_color: '#030f06', text_color: '#bbf7d0', button_style: 'rounded', button_color: '#16a34a' },
  },
  {
    label: 'Neon',      emoji: '⚡', minPlan: 'silver',
    theme: { bg_color: '#050012', text_color: '#f0abfc', button_style: 'pill', button_color: '#a855f7' },
  },
  {
    label: 'Rose',      emoji: '🌹', minPlan: 'silver',
    theme: { bg_color: '#120008', text_color: '#fce7f3', button_style: 'pill', button_color: '#db2777' },
  },
  {
    label: 'Carbon',    emoji: '🖤', minPlan: 'silver',
    theme: { bg_color: '#111111', text_color: '#a3a3a3', button_style: 'sharp', button_color: '#262626' },
  },
  {
    label: 'Arctic',    emoji: '🧊', minPlan: 'silver',
    theme: { bg_color: '#f0f9ff', text_color: '#0c4a6e', button_style: 'rounded', button_color: '#0284c7' },
  },
]

const BUTTON_STYLES: { label: string; value: Theme['button_style']; preview: string }[] = [
  { label: 'Rounded',  value: 'rounded', preview: 'rounded-lg' },
  { label: 'Pill',     value: 'pill',    preview: 'rounded-full' },
  { label: 'Sharp',    value: 'sharp',   preview: 'rounded-none' },
]

export default function ProfileTheme({ theme, onChange, plan }: Props) {
  const canCustomize = plan === 'silver'

  return (
    <div className="space-y-6">

      {/* Theme grid */}
      <div>
        <p className="text-sm font-medium text-slate-300 mb-3">Choose a theme</p>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((p) => {
            const unlocked = isUnlocked(p.minPlan, plan)
            const active = theme.bg_color === p.theme.bg_color && theme.text_color === p.theme.text_color

            return (
              <button
                key={p.label}
                onClick={() => unlocked && onChange({ ...p.theme })}
                disabled={!unlocked}
                title={!unlocked ? `Requires ${p.minPlan} plan` : p.label}
                className={clsx(
                  'relative h-16 rounded-xl border-2 text-xs font-medium overflow-hidden transition-all group',
                  !unlocked ? 'cursor-not-allowed' : 'hover:scale-[1.03]',
                  active ? 'border-violet-500 ring-2 ring-violet-400/50' : 'border-transparent'
                )}
                style={{ backgroundColor: p.theme.bg_color }}
              >
                {/* Preview button bar */}
                <div
                  className="absolute bottom-2 left-2 right-2 h-3 rounded-sm opacity-70"
                  style={{ backgroundColor: p.theme.button_color, borderRadius: p.theme.button_style === 'pill' ? '99px' : p.theme.button_style === 'sharp' ? '2px' : '6px' }}
                />
                {/* Label */}
                <span
                  className="absolute top-1.5 left-0 right-0 text-center text-[10px] font-semibold"
                  style={{ color: p.theme.text_color }}
                >
                  {p.emoji} {p.label}
                </span>
                {/* Lock overlay */}
                {!unlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                    <Lock size={12} className="text-white/60" />
                    <span className="text-[9px] text-white/50 mt-0.5 capitalize">{p.minPlan}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Button style */}
      <div>
        <p className="text-sm font-medium text-slate-300 mb-3">Button style</p>
        <div className="flex gap-2">
          {BUTTON_STYLES.map(({ label, value, preview }) => (
            <button
              key={value}
              onClick={() => onChange({ ...theme, button_style: value })}
              className={clsx(
                'flex-1 py-3 flex flex-col items-center gap-1.5 border transition-all text-xs font-medium rounded-xl',
                theme.button_style === value
                  ? 'bg-violet-500/15 border-violet-400 text-violet-300'
                  : 'border-white/10 text-slate-500 hover:border-white/20'
              )}
            >
              <div
                className={clsx('w-8 h-2 bg-current opacity-40', preview)}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors — Silver only */}
      {canCustomize ? (
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3">Custom colors</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Background', key: 'bg_color' as const },
              { label: 'Text',       key: 'text_color' as const },
              { label: 'Buttons',    key: 'button_color' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <label className="text-xs text-slate-500">{label}</label>
                <label className="cursor-pointer group">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-white/10 group-hover:border-violet-400 transition-colors shadow-sm"
                    style={{ backgroundColor: (theme[key] as string) || '#000' }}
                  />
                  <input
                    type="color"
                    value={(theme[key] as string) || '#000000'}
                    onChange={(e) => onChange({ ...theme, [key]: e.target.value })}
                    className="sr-only"
                  />
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{(theme[key] as string) || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lock size={13} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-800">Custom colors — Silver plan</p>
            <a href="/dashboard/upgrade" className="text-xs text-violet-600 hover:underline">Upgrade to unlock →</a>
          </div>
        </div>
      )}
    </div>
  )
}
