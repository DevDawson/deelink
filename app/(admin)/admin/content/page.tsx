'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import {
  HeroSettings, StatItem, Testimonial, FaqItem, AnnouncementSettings, SiteSettingsData,
} from '@/lib/types'
import {
  Save, Loader, Plus, Trash2, GripVertical,
  Megaphone, LayoutTemplate, BarChart2, MessageSquare, HelpCircle,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Shared ────────────────────────────────────────────────────────────────────

const labelCls  = 'block text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1.5'
const inputCls  = 'w-full rounded-xl px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500'
const inputStyle = { background: 'var(--input-bg)', border: '1px solid var(--border)' }

function Section({ title, icon, onSave, saving, children }: {
  title: string; icon: React.ReactNode; onSave: () => void; saving: boolean; children: React.ReactNode
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-violet-500">{icon}</span>
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h2>
        </div>
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
          {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ── Announcement ──────────────────────────────────────────────────────────────

function AnnouncementEditor({ initial, onSave }: { initial: AnnouncementSettings; onSave: (v: AnnouncementSettings) => Promise<void> }) {
  const [data, setData]   = useState(initial)
  const [saving, setSaving] = useState(false)

  const save = async () => { setSaving(true); await onSave(data); setSaving(false) }

  return (
    <Section title="Announcement Banner" icon={<Megaphone size={16} />} onSave={save} saving={saving}>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5">
        <button type="button" onClick={() => setData(d => ({ ...d, active: !d.active }))}
          className={`relative w-10 h-5 rounded-full transition-colors ${data.active ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.active ? 'translate-x-5' : ''}`} />
        </button>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {data.active ? 'Banner is visible on site' : 'Banner is hidden'}
        </span>
      </div>

      <div>
        <label className={labelCls}>Banner message</label>
        <input value={data.text} onChange={e => setData(d => ({ ...d, text: e.target.value }))}
          className={inputCls} style={inputStyle} placeholder="e.g. 🎉 New feature: QR codes are now available!" />
      </div>

      <div>
        <label className={labelCls}>Type</label>
        <div className="flex gap-2">
          {(['info', 'success', 'warning'] as const).map(t => (
            <button key={t} type="button" onClick={() => setData(d => ({ ...d, type: t }))}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${
                data.type === t
                  ? t === 'info' ? 'bg-blue-600 border-blue-600 text-white'
                  : t === 'success' ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-amber-500 border-amber-500 text-white'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-violet-400'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {data.active && data.text && (
        <div className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
          data.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
          : data.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
        }`}>
          Preview: {data.text}
        </div>
      )}
    </Section>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroEditor({ initial, onSave }: { initial: HeroSettings; onSave: (v: HeroSettings) => Promise<void> }) {
  const [data, setData]   = useState(initial)
  const [saving, setSaving] = useState(false)

  const save = async () => { setSaving(true); await onSave(data); setSaving(false) }

  return (
    <Section title="Hero Section" icon={<LayoutTemplate size={16} />} onSave={save} saving={saving}>
      <div>
        <label className={labelCls}>Main headline</label>
        <textarea rows={2} value={data.headline} onChange={e => setData(d => ({ ...d, headline: e.target.value }))}
          className={`${inputCls} resize-none`} style={inputStyle}
          placeholder="Your Artist Hub. One Link." />
        <p className="text-[10px] text-[var(--muted)] mt-1">This is the big text at the top of the page.</p>
      </div>
      <div>
        <label className={labelCls}>Sub-headline</label>
        <textarea rows={3} value={data.subheadline} onChange={e => setData(d => ({ ...d, subheadline: e.target.value }))}
          className={`${inputCls} resize-none`} style={inputStyle}
          placeholder="Share your music, videos, bookings…" />
      </div>
      <div>
        <label className={labelCls}>Primary CTA button text</label>
        <input value={data.cta} onChange={e => setData(d => ({ ...d, cta: e.target.value }))}
          className={inputCls} style={inputStyle} placeholder="Create Your Free Page" />
      </div>
    </Section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function StatsEditor({ initial, onSave }: { initial: StatItem[]; onSave: (v: StatItem[]) => Promise<void> }) {
  const [items, setItems] = useState<StatItem[]>(initial)
  const [saving, setSaving] = useState(false)

  const update = (i: number, field: keyof StatItem, val: string) =>
    setItems(prev => prev.map((x, idx) => idx === i ? { ...x, [field]: val } : x))

  const save = async () => { setSaving(true); await onSave(items); setSaving(false) }

  return (
    <Section title="Stats Bar" icon={<BarChart2 size={16} />} onSave={save} saving={saving}>
      <p className="text-xs text-[var(--muted)]">The 4 numbers shown in the strip below the hero.</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-2 p-3 rounded-xl bg-black/5 dark:bg-white/5">
            <input value={item.value} onChange={e => update(i, 'value', e.target.value)}
              className={inputCls} style={inputStyle} placeholder="1,200+" />
            <input value={item.label} onChange={e => update(i, 'label', e.target.value)}
              className={inputCls} style={inputStyle} placeholder="Artists" />
          </div>
        ))}
      </div>
    </Section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function TestimonialsEditor({ initial, onSave }: { initial: Testimonial[]; onSave: (v: Testimonial[]) => Promise<void> }) {
  const [items, setItems] = useState<Testimonial[]>(initial)
  const [saving, setSaving] = useState(false)

  const update = (i: number, field: keyof Testimonial, val: string) =>
    setItems(prev => prev.map((x, idx) => idx === i ? { ...x, [field]: val } : x))

  const add = () => setItems(prev => [...prev, { name: '', role: '', avatar: '', color: '#7c3aed', text: '' }])
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const save = async () => { setSaving(true); await onSave(items); setSaving(false) }

  return (
    <Section title="Testimonials" icon={<MessageSquare size={16} />} onSave={save} saving={saving}>
      <div className="space-y-4">
        {items.map((t, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl p-4 space-y-3 relative">
            <button onClick={() => remove(i)}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 size={13} />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Name</label>
                <input value={t.name} onChange={e => update(i, 'name', e.target.value)}
                  className={inputCls} style={inputStyle} placeholder="Jay Mwenda" />
              </div>
              <div>
                <label className={labelCls}>Role / City</label>
                <input value={t.role} onChange={e => update(i, 'role', e.target.value)}
                  className={inputCls} style={inputStyle} placeholder="Producer · Nairobi" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Avatar letter</label>
                <input value={t.avatar} maxLength={2} onChange={e => update(i, 'avatar', e.target.value)}
                  className={inputCls} style={inputStyle} placeholder="J" />
              </div>
              <div>
                <label className={labelCls}>Avatar color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={t.color} onChange={e => update(i, 'color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer bg-transparent" />
                  <input value={t.color} onChange={e => update(i, 'color', e.target.value)}
                    className={`${inputCls} flex-1`} style={inputStyle} placeholder="#7c3aed" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Quote text</label>
              <textarea rows={2} value={t.text} onChange={e => update(i, 'text', e.target.value)}
                className={`${inputCls} resize-none`} style={inputStyle} placeholder="What they said about deeLink…" />
            </div>
          </div>
        ))}
        <button onClick={add}
          className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)] hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-400/50 transition-colors flex items-center justify-center gap-2">
          <Plus size={14} />
          Add testimonial
        </button>
      </div>
    </Section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function FaqEditor({ initial, onSave }: { initial: FaqItem[]; onSave: (v: FaqItem[]) => Promise<void> }) {
  const [items, setItems] = useState<FaqItem[]>(initial)
  const [saving, setSaving] = useState(false)

  const update = (i: number, field: keyof FaqItem, val: string) =>
    setItems(prev => prev.map((x, idx) => idx === i ? { ...x, [field]: val } : x))

  const add    = () => setItems(prev => [...prev, { q: '', a: '' }])
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const save = async () => { setSaving(true); await onSave(items); setSaving(false) }

  return (
    <Section title="FAQ" icon={<HelpCircle size={16} />} onSave={save} saving={saving}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl p-4 space-y-2 relative">
            <div className="flex items-center gap-2 mb-1">
              <GripVertical size={14} className="text-[var(--muted)]" />
              <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wide">Q{i + 1}</span>
              <button onClick={() => remove(i)}
                className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
            <input value={item.q} onChange={e => update(i, 'q', e.target.value)}
              className={inputCls} style={inputStyle} placeholder="Question?" />
            <textarea rows={2} value={item.a} onChange={e => update(i, 'a', e.target.value)}
              className={`${inputCls} resize-none`} style={inputStyle} placeholder="Answer…" />
          </div>
        ))}
        <button onClick={add}
          className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)] hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-400/50 transition-colors flex items-center justify-center gap-2">
          <Plus size={14} />
          Add FAQ item
        </button>
      </div>
    </Section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const DEFAULTS: SiteSettingsData = {
  announcement: { active: false, text: '', type: 'info' },
  hero:  { headline: 'Your Artist Hub. One Link.', subheadline: '', cta: 'Create Your Free Page' },
  stats: [{ value: '1,200+', label: 'Artists' }, { value: '18K+', label: 'Links' }, { value: '5', label: 'Countries' }, { value: '100%', label: 'Mobile' }],
  testimonials: [],
  faq: [],
}

export default function ContentPage() {
  const [data, setData]     = useState<SiteSettingsData>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    adminApi.getSettings()
      .then(res => setData({ ...DEFAULTS, ...res.data.data }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const saveSetting = async (key: string, value: unknown) => {
    try {
      await adminApi.updateSetting(key, value)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      toast.success('Saved!')
    } catch {
      toast.error('Failed to save')
      throw new Error('save failed')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-48 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Content Editor</h1>
          <p className="text-[var(--muted)] text-sm mt-0.5">Edit your landing page content. Changes go live immediately.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle size={15} />
            All changes saved
          </div>
        )}
      </div>

      <AnnouncementEditor
        initial={data.announcement ?? DEFAULTS.announcement!}
        onSave={v => saveSetting('announcement', v)} />

      <HeroEditor
        initial={data.hero ?? DEFAULTS.hero!}
        onSave={v => saveSetting('hero', v)} />

      <StatsEditor
        initial={data.stats ?? DEFAULTS.stats!}
        onSave={v => saveSetting('stats', v)} />

      <TestimonialsEditor
        initial={data.testimonials ?? DEFAULTS.testimonials!}
        onSave={v => saveSetting('testimonials', v)} />

      <FaqEditor
        initial={data.faq ?? DEFAULTS.faq!}
        onSave={v => saveSetting('faq', v)} />
    </div>
  )
}
