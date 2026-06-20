'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { artistApi } from '@/lib/api'
import { Artist } from '@/lib/types'
import ProfileTheme from '@/components/ProfileTheme'
import toast from 'react-hot-toast'
import { Camera, Save, Loader, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react'

const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors'

export default function SettingsPage() {
  const router = useRouter()
  const { artist, updateArtist, clearAuth } = useAuthStore()
  const [form, setForm] = useState<Partial<Artist> | null>(null)
  const [saving, setSaving] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef  = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const [coverSrc,  setCoverSrc]  = useState<string | null>(null)

  // Password change state
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletePw, setDeletePw] = useState('')
  const [deleting, setDeleting] = useState(false)

  const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
  const validPath = (p: string | null | undefined) =>
    p && p !== 'null' && p !== '' ? `${apiBase}/storage/${p}` : null

  useEffect(() => {
    if (artist) {
      setForm({ ...artist })
      setAvatarSrc(validPath(artist.avatar_path))
      setCoverSrc(validPath(artist.cover_path))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist])

  if (!artist || !form) {
    return <div className="flex justify-center py-12"><Loader className="animate-spin text-slate-600" size={24} /></div>
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: { display_name?: string; bio?: string | null; theme?: object; avatar?: File; cover?: File } = {
        display_name: form.display_name,
        bio:   form.bio || null,
        theme: form.theme,
      }
      if (avatarRef.current?.files?.[0]) payload.avatar = avatarRef.current.files[0]
      if (coverRef.current?.files?.[0])  payload.cover  = coverRef.current.files[0]
      const res = await artistApi.updateProfile(payload)
      updateArtist(res.data.data)
      toast.success('Profile saved!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.password !== pwForm.password_confirmation) {
      toast.error('Passwords do not match.')
      return
    }
    setPwSaving(true)
    try {
      await artistApi.changePassword(pwForm)
      toast.success('Password updated. Signing you out…')
      setTimeout(() => {
        clearAuth()
        document.cookie = 'deelink_logged_in=0; path=/; max-age=0'
        router.push('/login')
      }, 1500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to change password.')
    } finally {
      setPwSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== artist.username) {
      toast.error(`Type "${artist.username}" to confirm.`)
      return
    }
    setDeleting(true)
    try {
      await artistApi.deleteAccount({ password: deletePw })
      toast.success('Account deleted.')
      clearAuth()
      document.cookie = 'deelink_logged_in=0; path=/; max-age=0'
      router.push('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to delete account.')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-white">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          {saving ? <Loader size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>

      {/* Profile card */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Cover */}
        <div
          className="h-28 relative cursor-pointer group"
          style={{ backgroundColor: form.theme?.bg_color || '#1e0a3c' }}
          onClick={() => coverRef.current?.click()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {coverSrc && <img src={coverSrc} alt="cover" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 z-10 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
            <Camera size={18} className="text-white" />
            <span className="text-white text-sm font-medium">Change banner</span>
          </div>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (f) setCoverSrc(URL.createObjectURL(f))
          }} />
        </div>

        <div className="px-5 pb-5">
          {/* Avatar */}
          <div className="relative -mt-9 mb-4 w-fit">
            <div
              className="w-[72px] h-[72px] rounded-full border-[3px] border-[#0a0a0f] overflow-hidden bg-slate-800 cursor-pointer group relative"
              onClick={() => avatarRef.current?.click()}
            >
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-400">
                  {form.display_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="absolute inset-0 z-10 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <Camera size={15} className="text-white" />
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (f) setAvatarSrc(URL.createObjectURL(f))
            }} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Display name</label>
              <input
                type="text"
                value={form.display_name || ''}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className={inputClass}
                placeholder="Your artist name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Bio</label>
              <textarea
                value={!form.bio || form.bio === 'null' ? '' : form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value || null })}
                rows={3}
                maxLength={160}
                className={`${inputClass} resize-none`}
                placeholder="Tell people a little about yourself…"
              />
              <p className="text-xs text-slate-700 text-right mt-1">
                {(!form.bio || form.bio === 'null' ? '' : form.bio).length}/160
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold text-white mb-4">Appearance</h2>
        <ProfileTheme
          theme={form.theme || { bg_color: '#0f0f0f', text_color: '#ffffff', button_style: 'rounded' }}
          onChange={(theme) => setForm({ ...form, theme })}
          plan={artist.plan}
        />
      </div>

      {/* Password change */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={15} className="text-violet-400" />
          <h2 className="font-bold text-white">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { key: 'current_password', label: 'Current password', show: showPw },
            { key: 'password',         label: 'New password' },
            { key: 'password_confirmation', label: 'Confirm new password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pwForm[key as keyof typeof pwForm]}
                  onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                  className={`${inputClass} pr-10`}
                  required
                  minLength={key !== 'current_password' ? 8 : undefined}
                  placeholder="••••••••"
                />
                {key === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={pwSaving}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {pwSaving && <Loader size={13} className="animate-spin" />}
            {pwSaving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="border border-red-500/20 rounded-2xl p-5 bg-red-500/5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={15} className="text-red-400" />
          <h2 className="font-bold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
          Permanently delete your account, profile, and all links. This cannot be undone.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">
              Type <span className="font-mono text-red-400 font-bold">{artist.username}</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full bg-white/3 border border-red-500/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder={artist.username}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Your password</label>
            <input
              type="password"
              value={deletePw}
              onChange={(e) => setDeletePw(e.target.value)}
              className="w-full bg-white/3 border border-red-500/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirm !== artist.username || !deletePw}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {deleting && <Loader size={13} className="animate-spin" />}
            {deleting ? 'Deleting…' : 'Delete my account'}
          </button>
        </div>
      </div>
    </div>
  )
}
