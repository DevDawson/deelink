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
  email: string
  email_verified_at: string | null
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
  artist: Artist
}
