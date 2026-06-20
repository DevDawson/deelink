'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { artistApi } from '@/lib/api'
import { AnalyticsData } from '@/lib/types'
import { hasAnalyticsFeature } from '@/lib/plans'
import React from 'react'
import { Eye, MousePointerClick, TrendingUp, Lock, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts'

function LockedCard({ label, plan }: { label: string; plan: string }) {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[120px]">
      <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
        <Lock size={15} className="text-slate-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="text-xs text-slate-600 mt-0.5">Requires {plan} plan</p>
      </div>
      <Link
        href="/dashboard/upgrade"
        className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
      >
        Upgrade →
      </Link>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={16} />
      </div>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  )
}

interface TooltipPayload { value: number }
interface ChartTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string }

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">{payload[0].value} views</p>
    </div>
  )
}

const BarTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1 truncate max-w-[160px]">{label}</p>
      <p className="text-white font-bold">{payload[0].value} clicks</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const { artist } = useAuthStore()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    artistApi.getAnalytics({ from: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) })
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (!artist) return null
  const plan = artist.plan

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-56 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    )
  }

  const viewsChartData = data?.views_by_date?.map((d) => ({
    date: d.date.slice(5),
    views: d.views,
  })) ?? []

  const topLinksData = data?.top_links?.slice(0, 5) ?? []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Last 7 days · <span className="capitalize text-violet-400">{plan}</span> plan</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={Eye}               label="Profile Views" value={data?.total_views ?? 0}  color="bg-violet-500/10 text-violet-400" />
        {hasAnalyticsFeature(plan, 'clicks') ? (
          <StatCard icon={MousePointerClick} label="Total Clicks"  value={data?.total_clicks ?? 0} color="bg-fuchsia-500/10 text-fuchsia-400" />
        ) : (
          <LockedCard label="Total Clicks" plan="Pro" />
        )}
      </div>

      {/* Views over time — Silver */}
      {hasAnalyticsFeature(plan, 'date_range') ? (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={15} className="text-violet-400" />
            <p className="text-sm font-semibold text-white">Views — Last 7 days</p>
          </div>
          {viewsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={viewsChartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-600 text-sm text-center py-10">No data yet for this period.</p>
          )}
        </div>
      ) : (
        <LockedCard label="Views over time chart" plan="Silver" />
      )}

      {/* Top Links — Silver */}
      {hasAnalyticsFeature(plan, 'top_links') ? (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={15} className="text-fuchsia-400" />
            <p className="text-sm font-semibold text-white">Top Links by Clicks</p>
          </div>
          {topLinksData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topLinksData} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="title" type="category" width={110} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 14) + '…' : v} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="clicks" radius={[0, 6, 6, 0]}>
                  {topLinksData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#7c3aed' : `rgba(124,58,237,${0.7 - i * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-600 text-sm text-center py-8">No clicks recorded yet.</p>
          )}
        </div>
      ) : (
        <LockedCard label="Top links chart" plan="Silver" />
      )}
    </div>
  )
}
