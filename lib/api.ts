import axios from 'axios'
import {
  AuthResponse, Artist, Link, PublicProfile, AnalyticsData,
  AdminUser, SiteSettingsData,
} from './types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('deelink-auth')
    if (stored) {
      try {
        const { state } = JSON.parse(stored)
        if (state?.token) config.headers.Authorization = `Bearer ${state.token}`
      } catch {}
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('deelink-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    name: string; email?: string; phone?: string
    password: string; password_confirmation: string; username: string
  }) => api.post<{ data: AuthResponse }>('/api/register', data),

  login: (data: { identifier: string; password: string }) =>
    api.post<{ data: AuthResponse }>('/api/login', data),

  logout: () => api.post('/api/logout'),
  me:     () => api.get<{ data: AuthResponse }>('/api/me'),

  checkUsername: (username: string) =>
    api.get<{ available: boolean }>(`/api/check-username/${username}`),
}

// ── Artist dashboard ──────────────────────────────────────────────────────────

export const artistApi = {
  getProfile: () => api.get<{ data: Artist }>('/api/artist/profile'),

  updateProfile: (data: {
    display_name?: string; bio?: string | null; theme?: object; avatar?: File; cover?: File
  }) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      if (v instanceof File)       form.append(k, v)
      else if (typeof v === 'object') form.append(k, JSON.stringify(v))
      else                         form.append(k, String(v))
    })
    return api.post<{ data: Artist }>('/api/artist/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getLinks:     () => api.get<{ data: Link[] }>('/api/artist/links'),
  createLink:   (data: Partial<Link>) => api.post<{ data: Link }>('/api/artist/links', data),
  updateLink:   (id: number, data: Partial<Link>) => api.put<{ data: Link }>(`/api/artist/links/${id}`, data),
  deleteLink:   (id: number) => api.delete(`/api/artist/links/${id}`),
  reorderLinks: (ids: number[]) => api.post('/api/artist/links/reorder', { ids }),

  getAnalytics: (params?: { from?: string; to?: string }) =>
    api.get<{ data: AnalyticsData }>('/api/artist/analytics', { params }),

  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.post<{ message: string }>('/api/artist/password', data),

  deleteAccount: (data: { password: string }) =>
    api.delete<{ message: string }>('/api/artist/account', { data }),
}

// ── Public ────────────────────────────────────────────────────────────────────

export const publicApi = {
  getProfile: (username: string) =>
    api.get<{ data: PublicProfile }>(`/api/public/${username}`),
  logView:  (username: string) => api.post(`/api/public/${username}/view`),
  logClick: (linkId: number)   => api.post(`/api/links/${linkId}/click`),
}

// ── Site settings (public read) ───────────────────────────────────────────────

export const settingsApi = {
  getAll: () => api.get<{ data: SiteSettingsData }>('/api/settings'),
}

// ── Subscriptions (artist) ────────────────────────────────────────────────────

export const subscribeApi = {
  subscribe: (plan: string) =>
    api.post<{ data: { redirect_url: string; order_tracking_id: string } }>('/api/subscribe', { plan }),

  status: (trackingId: string) =>
    api.get<{
      status: 'pending' | 'active' | 'failed' | 'expired' | 'cancelled' | 'not_found'
      plan?: string
      expires?: string
    }>(`/api/subscribe/status/${trackingId}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Stats
  getStats: () =>
    api.get<{ data: {
      total_users: number; total_artists: number; paid_artists: number
      free_artists: number; new_today: number; total_revenue: number
    } }>('/api/admin/stats'),

  // Users
  getUsers: (params?: { search?: string; plan?: string; role?: string; page?: number }) =>
    api.get('/api/admin/users', { params }),

  createUser: (data: { name: string; email?: string; phone?: string; username: string; password?: string }) =>
    api.post<{ data: { user: AdminUser & { username: string }; password: string } }>('/api/admin/users', data),

  resetPassword: (userId: number) =>
    api.post<{ data: { password: string } }>(`/api/admin/users/${userId}/reset-password`),

  toggleActive: (userId: number) =>
    api.post<{ data: { is_active: boolean } }>(`/api/admin/users/${userId}/toggle-active`),

  toggleAdmin: (userId: number) =>
    api.post<{ data: { role: string } }>(`/api/admin/users/${userId}/toggle-admin`),

  grantPlan: (userId: number, data: { plan: string; months: number }) =>
    api.post<{ data: { plan: string; expires_at: string }; message: string }>(
      `/api/admin/users/${userId}/grant-plan`, data
    ),

  deleteUser: (userId: number) => api.delete(`/api/admin/users/${userId}`),

  // Subscriptions
  getSubscriptions: (params?: { status?: string; plan?: string; page?: number }) =>
    api.get('/api/admin/subscriptions', { params }),

  cancelSubscription: (subId: number) =>
    api.post(`/api/admin/subscriptions/${subId}/cancel`),

  extendSubscription: (subId: number, months: number) =>
    api.post<{ data: { expires_at: string }; message: string }>(
      `/api/admin/subscriptions/${subId}/extend`, { months }
    ),

  // Site settings
  getSettings: () =>
    api.get<{ data: SiteSettingsData }>('/api/admin/settings'),

  updateSetting: (key: string, value: unknown) =>
    api.put<{ data: unknown; message: string }>(`/api/admin/settings/${key}`, { value }),
}

export default api
