export type Plan = 'free' | 'starter' | 'pro' | 'silver' | 'premium'

export type LinkType =
  | 'youtube'
  | 'audiomack'
  | 'spotify'
  | 'instagram'
  | 'whatsapp'
  | 'tiktok'
  | 'custom'

export interface User {
  id: number
  name: string
  email: string | null
  phone: string | null
  role: 'user' | 'admin'
  email_verified_at: string | null
}

export interface AdminUser {
  id: number
  name: string
  email: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
  artist: Artist | null
}

export interface Theme {
  bg_color: string
  text_color: string
  button_style: 'rounded' | 'sharp' | 'pill'
  button_color?: string
  accent_color?: string
}

export interface Artist {
  id: number
  user_id: number
  username: string
  display_name: string
  bio: string | null
  avatar_path: string | null
  cover_path: string | null
  theme: Theme
  plan: Plan
  is_active: boolean
}

export interface Link {
  id: number
  artist_id: number
  type: LinkType
  title: string
  url: string
  embed_id: string | null
  thumbnail_url: string | null
  position: number
  is_active: boolean
  click_count: number
}

export interface PublicProfile {
  artist: Artist
  links: Link[]
}

export interface AnalyticsData {
  total_views: number
  total_clicks: number | null
  top_links: { link_id: number; title: string; clicks: number }[] | null
  views_by_date: { date: string; views: number }[] | null
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthResponse {
  token: string
  user: User
  artist: Artist | null
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

export interface Subscription {
  id: number
  artist_id: number
  plan: Plan
  status: 'active' | 'expired' | 'cancelled'
  pesapal_tracking_id: string | null
  amount: number
  currency: string
  starts_at: string | null
  expires_at: string | null
  created_at: string
  artist: {
    id: number
    username: string
    display_name: string
    user: { id: number; name: string; email: string | null; phone: string | null } | null
  } | null
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface HeroSettings {
  headline: string
  subheadline: string
  cta: string
}

export interface StatItem {
  value: string
  label: string
}

export interface Testimonial {
  name: string
  role: string
  avatar: string
  color: string
  text: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface AnnouncementSettings {
  active: boolean
  text: string
  type: 'info' | 'warning' | 'success'
}

export interface SiteSettingsData {
  announcement?: AnnouncementSettings
  hero?: HeroSettings
  stats?: StatItem[]
  testimonials?: Testimonial[]
  faq?: FaqItem[]
}
