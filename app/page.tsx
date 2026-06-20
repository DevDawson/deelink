'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { settingsApi } from '@/lib/api'
import { AnnouncementSettings, StatItem, Testimonial, FaqItem as FaqItemType } from '@/lib/types'
import {
  Check, Zap, PlayCircle, BarChart2, Palette, ArrowRight, Star,
  Music2, Share2, Link2, TrendingUp, Smartphone, Globe, ChevronDown,
  ChevronUp, Video, Camera, Mic2, Radio, Headphones, MessageCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// ─── Data ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Free',
    price: 0,
    features: ['Up to 3 links', '1 default theme', 'deeLink badge', 'No analytics'],
    cta: 'Start Free',
    href: '/register',
  },
  {
    name: 'Starter',
    price: 5000,
    features: ['Up to 5 links', '2 themes', 'deeLink badge', 'Views analytics'],
    cta: 'Get Starter',
    href: '/register',
  },
  {
    name: 'Pro',
    price: 10000,
    features: ['Up to 15 links', 'All themes', 'No branding', 'Views + clicks'],
    cta: 'Go Pro',
    href: '/register',
    popular: true,
  },
  {
    name: 'Silver',
    price: 30000,
    features: ['Unlimited links', 'Custom colors', 'No branding', 'Full analytics'],
    cta: 'Go Silver',
    href: '/register',
  },
]

const FEATURES = [
  {
    icon: PlayCircle,
    color: 'from-red-500 to-orange-500',
    title: 'Inline Playback',
    desc: 'YouTube, Spotify & Audiomack play directly on your profile. Fans never leave your page.',
  },
  {
    icon: BarChart2,
    color: 'from-violet-500 to-indigo-500',
    title: 'Smart Analytics',
    desc: 'See exactly which links perform best — views, clicks, and trends over time.',
  },
  {
    icon: Palette,
    color: 'from-fuchsia-500 to-pink-500',
    title: 'Custom Themes',
    desc: 'Colors, button styles, and layouts that match your brand. Your page, your rules.',
  },
  {
    icon: Smartphone,
    color: 'from-emerald-500 to-teal-500',
    title: 'Mobile-First',
    desc: 'Built for the phone screen first. Loads fast, looks sharp on every device.',
  },
  {
    icon: Share2,
    color: 'from-amber-500 to-yellow-500',
    title: 'One Link, Everywhere',
    desc: 'Put your deeLink in your Instagram bio, WhatsApp status, or TikTok profile.',
  },
  {
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-500',
    title: 'Grow Your Audience',
    desc: 'SEO-ready pages with Open Graph tags so your profile looks great when shared.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Create your page',
    desc: 'Sign up free and claim your username — e.g. deelink.cc/yourname',
    icon: Link2,
  },
  {
    n: '2',
    title: 'Add your links',
    desc: 'Paste YouTube, Spotify, Audiomack, Instagram or any URL. We handle the rest.',
    icon: Music2,
  },
  {
    n: '3',
    title: 'Share everywhere',
    desc: 'One link in your bio that fans tap to reach all your content at once.',
    icon: Globe,
  },
]

const TESTIMONIALS = [
  {
    name: 'Jay Mwenda',
    role: 'Afrobeat Producer · Nairobi',
    avatar: 'J',
    color: '#7c3aed',
    text: 'deeLink changed how I share my beats. Before I had 10 links in my bio — now I have one and my streams actually went up.',
  },
  {
    name: 'Neema Aisha',
    role: 'RnB Artist · Dar es Salaam',
    avatar: 'N',
    color: '#db2777',
    text: 'Watoto wangu wa fans wanaweza kusikia muziki wangu moja kwa moja bila kwenda YouTube. Ni rahisi sana!',
  },
  {
    name: 'Stivo Classic Jr.',
    role: 'Gospel · Kampala',
    avatar: 'S',
    color: '#0891b2',
    text: 'The analytics show me exactly which song gets the most clicks. I know what my audience wants now.',
  },
]

const FAQS = [
  {
    q: 'Je, deeLink ni bure?',
    a: 'Ndiyo! Unaweza kuanza bila kulipa — unapata hadi links 3 na theme 1. Ukitaka zaidi, panga upgrade wakati wowote.',
  },
  {
    q: 'Ninaweza kulipa na M-Pesa?',
    a: 'Kabisa. Tunakubali M-Pesa na Pesapal. Hakuna credit card inayohitajika.',
  },
  {
    q: 'Je, video na muziki wacheza kwenye profile yangu?',
    a: 'Ndiyo. YouTube, Spotify, na Audiomack zinacheza inline — fan anabonyeza na muziki unacheza moja kwa moja, bila redirect.',
  },
  {
    q: 'Naweza kubadilisha username baadaye?',
    a: 'Username inaweza kubadilishwa mara moja. Chagua vizuri — fans wanakukumbuka kwa username yako.',
  },
]

const PLATFORMS = [
  { icon: Video,         label: 'YouTube',   color: 'text-red-500' },
  { icon: Headphones,    label: 'Audiomack', color: 'text-amber-500' },
  { icon: Radio,         label: 'Spotify',   color: 'text-green-500' },
  { icon: Camera,        label: 'Instagram', color: 'text-pink-500' },
  { icon: Mic2,          label: 'TikTok',    color: 'text-sky-500' },
  { icon: MessageCircle, label: 'WhatsApp',  color: 'text-emerald-500' },
]

const STATS = [
  { value: '1,200+', label: 'Artists' },
  { value: '18K+',   label: 'Links created' },
  { value: '5',      label: 'Countries' },
  { value: '100%',   label: 'Mobile-first' },
]

// ─── Components ──────────────────────────────────────────────────────────────

function PhoneMockup() {
  return (
    <div className="relative w-[240px] mx-auto select-none">
      <div className="absolute inset-[-20px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Phone shell — always dark (it's a phone preview) */}
      <div className="relative bg-[#0d0d18] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-20 h-1.5 rounded-full bg-white/10" />
        </div>

        <div className="mx-2 mb-3 rounded-[1.8rem] overflow-hidden" style={{ background: '#0f0f1a' }}>
          <div className="h-[68px] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-indigo-700" />

          <div className="px-3 pb-4 -mt-5">
            <div className="w-10 h-10 rounded-full border-[2.5px] border-[#0f0f1a] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm mb-2">
              D
            </div>
            <p className="text-white font-bold text-[11px]">Dauson Beats</p>
            <p className="text-slate-400 text-[9px] mb-3">Producer · Dar es Salaam 🇹🇿</p>

            {[
              { label: '▶  "Mapendo" — New Single', highlight: true },
              { label: '🎧  Beat Store',             highlight: false },
              { label: '💬  WhatsApp Booking',       highlight: false },
              { label: '📸  Instagram',              highlight: false },
            ].map(({ label, highlight }) => (
              <div
                key={label}
                className="mb-1.5 rounded-lg px-2.5 py-2 text-[9px] font-medium text-white"
                style={{ background: highlight ? '#7c3aed' : '#1a1a2e' }}
              >
                {label}
              </div>
            ))}

            <div className="mt-2.5 rounded-lg bg-white/5 border border-white/10 px-2.5 py-2 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[40%] bg-violet-500 rounded-full" />
                </div>
              </div>
              <PlayCircle size={10} className="text-violet-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges — always dark to contrast the phone */}
      <div className="absolute -right-6 top-12 bg-[#0d0d18] border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-white font-medium flex items-center gap-1.5 shadow-lg">
        <TrendingUp size={10} className="text-emerald-400" />
        +124 views
      </div>
      <div className="absolute -left-8 bottom-16 bg-[#0d0d18] border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-white font-medium flex items-center gap-1.5 shadow-lg">
        <PlayCircle size={10} className="text-red-400" />
        Plays inline
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full text-left glass rounded-2xl px-6 py-5 transition-all hover:border-violet-500/30"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-900 dark:text-white">{q}</span>
        {open
          ? <ChevronUp   size={16} className="text-violet-500 flex-shrink-0" />
          : <ChevronDown size={16} className="text-[var(--muted)] flex-shrink-0" />}
      </div>
      {open && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed">{a}</p>
      )}
    </button>
  )
}

// ─── Section divider ─────────────────────────────────────────────────────────
const divider = 'border-t border-[var(--border)]'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [announcement, setAnnouncement] = useState<AnnouncementSettings | null>(null)
  const [stats, setStats]               = useState<StatItem[]>(STATS)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS)
  const [faqs, setFaqs]                 = useState<FaqItemType[]>(FAQS)

  useEffect(() => {
    settingsApi.getAll().then(res => {
      const d = res.data.data
      if (d.announcement?.active && d.announcement.text) setAnnouncement(d.announcement)
      if (d.stats?.length)        setStats(d.stats)
      if (d.testimonials?.length) setTestimonials(d.testimonials)
      if (d.faq?.length)          setFaqs(d.faq)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-xl bg-[var(--background)]/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            dee<span className="gradient-text">Link</span>
          </span>

          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</a>
            <a href="#faq"      className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Announcement banner ──────────────────────────────────── */}
      {announcement && (
        <div className={`text-sm font-medium text-center py-2.5 px-4 ${
          announcement.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-500/20'
            : announcement.type === 'warning'
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-b border-amber-200 dark:border-amber-500/20'
            : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-b border-blue-200 dark:border-blue-500/20'
        }`}>
          {announcement.text}
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute -top-60 -left-40 w-[700px] h-[700px] rounded-full bg-violet-600/10 dark:bg-violet-800/15 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-600/8 dark:bg-fuchsia-800/10 blur-[130px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">

          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 border border-violet-500/30 bg-violet-500/10 rounded-full px-4 py-1.5 text-xs text-violet-600 dark:text-violet-300 mb-6">
              <Zap size={11} className="text-violet-500" fill="currentColor" />
              Built for East African Artists
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight mb-5 text-slate-900 dark:text-white">
              Your Music.<br />
              <span className="gradient-text">One Page.</span><br />
              Everywhere.
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              One link that holds your YouTube, Audiomack, Spotify, Instagram — and lets fans
              play your music{' '}
              <em className="text-slate-700 dark:text-slate-300 not-italic">without leaving your page.</em>
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                Create your page free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 glass text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium px-6 py-3.5 rounded-xl transition-colors"
              >
                Sign in
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[var(--background)] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c }}
                  >
                    {['D', 'N', 'J', 'S', 'M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-0.5">
                  Trusted by 1,200+ artists in East Africa
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className={`${divider} border-b border-[var(--border)] py-8`}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black gradient-text">{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platforms ────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-xs uppercase tracking-widest mb-6 font-medium">
            Works seamlessly with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {PLATFORMS.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
                <Icon size={18} className={color} />
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className={`py-24 ${divider}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-violet-500 text-xs font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Ready in under 3 minutes</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            <div className="hidden sm:block absolute top-8 left-[calc(16.7%+1rem)] right-[calc(16.7%+1rem)] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            {STEPS.map(({ n, title, desc, icon: Icon }) => (
              <div key={n} className="relative glass rounded-2xl p-7 text-center group hover:border-violet-500/30 transition-all">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:border-violet-500/40 transition-all">
                    <Icon size={22} className="text-violet-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-600 text-[9px] font-black flex items-center justify-center text-white">
                    {n}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className={`py-24 ${divider}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-violet-500 text-xs font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Everything your fans need,<br className="hidden sm:block" /> in one place
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-6 transition-all group hover:-translate-y-1 hover:border-violet-500/20">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className={`py-24 ${divider}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-violet-500 text-xs font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Simple, honest pricing</h2>
            <p className="text-slate-500 mt-3 text-sm">Lipa na M-Pesa au Pesapal. Cancel anytime.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-violet-600/15 to-fuchsia-600/5 dark:from-violet-600/20 dark:to-fuchsia-600/10 border-violet-500/50 shadow-xl shadow-violet-500/10'
                    : 'glass hover:border-violet-500/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      <Zap size={9} fill="currentColor" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <p className={`text-sm font-semibold mb-1 ${plan.popular ? 'text-violet-600 dark:text-violet-300' : 'text-slate-500'}`}>
                    {plan.name}
                  </p>
                  {plan.price === 0 ? (
                    <span className="text-4xl font-black text-slate-900 dark:text-white">Free</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-400 self-start mt-2.5">TZS</span>
                      <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price.toLocaleString()}</span>
                      <span className="text-slate-400 text-xs">/mo</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Check size={13} className="text-violet-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all block ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5'
                      : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-[var(--border)]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            All plans include the core deeLink features. Upgrade or downgrade anytime.
          </p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className={`py-24 ${divider}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-violet-500 text-xs font-semibold uppercase tracking-widest mb-3">Artists love it</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Built by artists, for artists</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, avatar, color, text }) => (
              <div key={name} className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-violet-500/20 transition-all">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: color }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className={`py-24 ${divider}`}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-violet-500 text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Maswali ya kawaida</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className={`py-24 ${divider}`}>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] bg-violet-500/8 dark:bg-violet-700/10 rounded-full blur-3xl" />
          </div>

          <div className="relative glass rounded-3xl px-8 py-14 border border-violet-500/20">
            <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-xs text-violet-600 dark:text-violet-300 mb-6">
              <Zap size={10} fill="currentColor" /> Start in 60 seconds
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white">
              Your stage is<br />
              <span className="gradient-text">waiting for you.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Free forever. Upgrade when your audience grows. No credit card needed.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 text-sm"
            >
              Create your free page now
              <ArrowRight size={16} />
            </Link>
            <p className="text-slate-400 text-xs mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className={`${divider} py-12`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <p className="text-xl font-black mb-2 text-slate-900 dark:text-white">
                dee<span className="gradient-text">Link</span>
              </p>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
                The link-in-bio platform built for East African artists.
              </p>
            </div>

            <div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-4">Product</p>
              <ul className="space-y-2.5 text-sm">
                {[['#features', 'Features'], ['#pricing', 'Pricing'], ['#faq', 'FAQ']].map(([href, label]) => (
                  <li key={label}>
                    <a href={href} className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm mb-4">Account</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/register" className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Create account</Link></li>
                <li><Link href="/login"    className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Sign in</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
            <span>
              dee<span className="text-violet-500 font-semibold">Link</span> — Deeteki / Webmaster Crew
            </span>
            <span>© {new Date().getFullYear()} deeLink. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
