import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deelink.cc'
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || 'https://api.deelink.cc'

export const revalidate = 3600  // Rebuild sitemap at most once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             SITE_URL,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1,
    },
    {
      url:             `${SITE_URL}/login`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.3,
    },
    {
      url:             `${SITE_URL}/register`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.5,
    },
  ]

  // Dynamic artist profiles
  try {
    const res = await fetch(`${API_URL}/api/sitemap`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return staticPages

    const artists: { username: string; updated_at: string }[] = await res.json()

    const profilePages: MetadataRoute.Sitemap = artists.map(({ username, updated_at }) => ({
      url:             `${SITE_URL}/${username}`,
      lastModified:    new Date(updated_at),
      changeFrequency: 'weekly',
      priority:        0.8,
    }))

    return [...staticPages, ...profilePages]
  } catch {
    return staticPages
  }
}
