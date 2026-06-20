import Link from 'next/link'
import { Check, Zap, PlayCircle, BarChart2, Palette, ArrowRight, Star } from 'lucide-react'

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
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    title: 'Inline Playback',
    desc: 'YouTube, Spotify, and Audiomack play directly on your profile — fans never leave your page.',
  },
  {
    icon: BarChart2,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    title: 'Smart Analytics',
    desc: 'Know exactly which links get the most clicks and when your profile gets the most visits.',
  },
  {
    icon: Palette,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-400/10',
    title: 'Custom Themes',
    desc: 'Pick a theme that matches your brand. Pro and Silver artists get full color control.',
  },
]

// Simulated profile card for hero mockup
function ProfileMockup() {
  return (
    <div className="w-[260px] rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/50 border border-white/10 animate-float">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-br from-violet-700 via-fuchsia-600 to-indigo-700" />
      {/* Body */}
      <div className="bg-[#0e0e16] px-4 pb-5">
        {/* Avatar */}
        <div className="-mt-6 mb-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#0e0e16] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
        </div>
        <p className="text-white font-semibold text-sm">Dauson Beats</p>
        <p className="text-slate-400 text-xs mb-4">Producer · Dar es Salaam 🇹🇿</p>
        {/* Links */}
        {['New Single — "Mapendo"', 'Beat Store', 'WhatsApp Booking'].map((label, i) => (
          <div
            key={i}
            className="mb-2 rounded-xl px-3 py-2.5 text-xs font-medium text-white flex items-center justify-between"
            style={{ background: i === 0 ? '#7c3aed' : '#1a1a2e' }}
          >
            {label}
            {i === 0 && <PlayCircle size={14} className="text-violet-300" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#050508]/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            dee<span className="gradient-text">Link</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-700/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-violet-300 mb-6">
              <Zap size={12} className="text-violet-400" />
              Built for East African artists
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Your Links.{' '}
              <span className="gradient-text">Your Stage.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
              One link in bio that holds everything — YouTube videos play inline, music streams on the spot,
              and fans never leave your page.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30"
              >
                Create your page
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 glass text-slate-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-10">
              <div className="flex -space-x-2">
                {['#7c3aed', '#db2777', '#0891b2', '#059669'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050508]" style={{ background: c }} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">Trusted by artists across Tanzania</p>
              </div>
            </div>
          </div>

          {/* Right — Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-3xl scale-75 animate-pulse-glow" />
              <ProfileMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Why deeLink</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Everything your fans need,<br className="hidden sm:block" /> in one place</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-6 hover:border-white/20 transition-colors group">
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, honest pricing</h2>
            <p className="text-slate-400 mt-3">Pay with M-Pesa or Pesapal. Cancel anytime.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-violet-600/20 to-fuchsia-600/10 border border-violet-500/50 shadow-lg shadow-violet-500/10'
                    : 'glass hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      <Zap size={10} /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-slate-400 text-sm font-medium">{plan.name}</p>
                  <div className="mt-1">
                    {plan.price === 0 ? (
                      <span className="text-3xl font-black text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-xs text-slate-500 align-top mt-2 inline-block">TZS</span>
                        <span className="text-3xl font-black text-white mx-1">
                          {plan.price.toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-sm">/mo</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all block ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md hover:shadow-violet-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to build your<br />
            <span className="gradient-text">artist profile?</span>
          </h2>
          <p className="text-slate-400 mb-8">Free forever. Upgrade when you&apos;re ready.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-violet-500/30"
          >
            Create your free page
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <span>
            dee<span className="text-violet-400 font-semibold">Link</span> — Deeteki / Webmaster Crew
          </span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
