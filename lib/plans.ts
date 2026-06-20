import { Plan } from './types'

export interface PlanConfig {
  name: string
  price: number
  maxLinks: number
  themeCount: number | 'all'
  badge: boolean
  analytics: ('views' | 'clicks' | 'top_links' | 'date_range')[]
  customColors: boolean
  description: string
}

export const PLANS: Record<Exclude<Plan, 'premium'>, PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    maxLinks: 3,
    themeCount: 1,
    badge: true,
    analytics: [],
    customColors: false,
    description: 'Anza bila malipo',
  },
  starter: {
    name: 'Starter',
    price: 5000,
    maxLinks: 5,
    themeCount: 2,
    badge: true,
    analytics: ['views'],
    customColors: false,
    description: 'Kwa wasanii wanaoanza',
  },
  pro: {
    name: 'Pro',
    price: 10000,
    maxLinks: 15,
    themeCount: 'all',
    badge: false,
    analytics: ['views', 'clicks'],
    customColors: false,
    description: 'Kwa wasanii wa kazi',
  },
  silver: {
    name: 'Silver',
    price: 30000,
    maxLinks: Infinity,
    themeCount: 'all',
    badge: false,
    analytics: ['views', 'clicks', 'top_links', 'date_range'],
    customColors: true,
    description: 'Nguvu kamili — hakuna kikwazo',
  },
}

// 'premium' is the artist.plan value set by the backend after a successful payment.
// It isn't a display tier — map it to 'pro' for UI feature lookups.
const PLAN_MAP: Record<Plan, keyof typeof PLANS> = {
  free:    'free',
  starter: 'starter',
  pro:     'pro',
  silver:  'silver',
  premium: 'pro',
}

export const PLAN_ORDER: Plan[] = ['free', 'starter', 'pro', 'silver']

function resolve(plan: Plan): PlanConfig {
  return PLANS[PLAN_MAP[plan]]
}

export function canAddLink(plan: Plan, currentCount: number): boolean {
  return currentCount < resolve(plan).maxLinks
}

export function hasBadge(plan: Plan): boolean {
  return resolve(plan).badge
}

export function hasAnalyticsFeature(
  plan: Plan,
  feature: 'views' | 'clicks' | 'top_links' | 'date_range'
): boolean {
  return resolve(plan).analytics.includes(feature)
}

export function isUpgradeRequired(current: Plan, required: Plan): boolean {
  return PLAN_ORDER.indexOf(PLAN_MAP[current]) < PLAN_ORDER.indexOf(PLAN_MAP[required])
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Bure'
  return `TZS ${price.toLocaleString()}/mwezi`
}
