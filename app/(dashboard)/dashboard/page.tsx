'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { artistApi } from '@/lib/api'
import { Link } from '@/lib/types'
import { PLANS, canAddLink } from '@/lib/plans'
import LinkListEditor from '@/components/LinkListEditor'
import QRModal from '@/components/QRModal'
import React from 'react'
import { Eye, MousePointerClick, Link2, QrCode, ExternalLink } from 'lucide-react'
import NextLink from 'next/link'

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-white font-bold text-lg leading-none mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { artist } = useAuthStore()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ views: 0, clicks: 0 })
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    Promise.all([
      artistApi.getLinks(),
      artistApi.getAnalytics(),
    ]).then(([linksRes, analyticsRes]) => {
      setLinks(linksRes.data.data)
      const d = analyticsRes.data.data
      setStats({ views: d.total_views ?? 0, clicks: d.total_clicks ?? 0 })
    }).finally(() => setLoading(false))
  }, [])

  if (!artist) return null

  const plan = artist.plan
  const planConfig = PLANS[plan === 'premium' ? 'pro' : plan]
  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${artist.username}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-white">My Links</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {links.length}/{planConfig.maxLinks === Infinity ? '∞' : planConfig.maxLinks} links ·{' '}
            <span className="text-violet-400 font-medium capitalize">{plan}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 transition-colors"
          >
            <QrCode size={13} />
            QR Code
          </button>
          <NextLink
            href={`/${artist.username}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 border border-white/10 hover:border-violet-500/30 rounded-xl px-3 py-2 transition-colors"
          >
            <ExternalLink size={13} />
            Preview
          </NextLink>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Eye}             label="Total Views"  value={stats.views}        color="bg-violet-500/10 text-violet-400" />
        <StatCard icon={MousePointerClick} label="Link Clicks"  value={plan === 'free' || plan === 'starter' ? '—' : stats.clicks} color="bg-fuchsia-500/10 text-fuchsia-400" />
        <StatCard icon={Link2}           label="Active Links" value={links.filter(l => l.is_active).length} color="bg-blue-500/10 text-blue-400" />
      </div>

      {/* Links editor */}
      <div className="glass rounded-2xl p-4">
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <LinkListEditor
            initialLinks={links}
            canAdd={canAddLink(plan, links.length)}
            maxLinks={planConfig.maxLinks === Infinity ? 999 : planConfig.maxLinks}
          />
        )}
      </div>

      {showQR && (
        <QRModal url={profileUrl} username={artist.username} onClose={() => setShowQR(false)} />
      )}
    </div>
  )
}
