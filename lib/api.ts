import axios from 'axios'
import { AuthResponse, Artist, Link, PublicProfile, AnalyticsData } from './types'

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
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
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

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string; username: string }) =>
    api.post<{ data: AuthResponse }>('/api/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ data: AuthResponse }>('/api/login', data),

  logout: () => api.post('/api/logout'),

  me: () => api.get<{ data: AuthResponse }>('/api/me'),

  checkUsername: (username: string) =>
    api.get<{ available: boolean }>(`/api/check-username/${username}`),
}

// Artist dashboard
export const artistApi = {
  getProfile: () => api.get<{ data: Artist }>('/api/artist/profile'),

  updateProfile: (data: { display_name?: string; bio?: string | null; theme?: object; avatar?: File; cover?: File }) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      if (v instanceof File) form.append(k, v)
      else if (typeof v === 'object') form.append(k, JSON.stringify(v))
      else form.append(k, String(v))
    })
    return api.post<{ data: Artist }>('/api/artist/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getLinks: () => api.get<{ data: Link[] }>('/api/artist/links'),

  createLink: (data: Partial<Link>) =>
    api.post<{ data: Link }>('/api/artist/links', data),

  updateLink: (id: number, data: Partial<Link>) =>
    api.put<{ data: Link }>(`/api/artist/links/${id}`, data),

  deleteLink: (id: number) => api.delete(`/api/artist/links/${id}`),

  reorderLinks: (ids: number[]) =>
    api.post('/api/artist/links/reorder', { ids }),

  getAnalytics: (params?: { from?: string; to?: string }) =>
    api.get<{ data: AnalyticsData }>('/api/artist/analytics', { params }),

  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.post<{ message: string }>('/api/artist/password', data),

  deleteAccount: (data: { password: string }) =>
    api.delete<{ message: string }>('/api/artist/account', { data }),
}

// Public
export const publicApi = {
  getProfile: (username: string) =>
    api.get<{ data: PublicProfile }>(`/api/public/${username}`),

  logView: (username: string) =>
    api.post(`/api/public/${username}/view`),

  logClick: (linkId: number) =>
    api.post(`/api/links/${linkId}/click`),
}

// Subscription
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

export default api
