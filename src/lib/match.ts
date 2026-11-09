import type { Listing, Prefs } from '../types'

export function matchesPrefs(l: Listing, p: Prefs) {
  return (
    l.mode === p.mode &&
    (p.city === 'Any' || l.city === p.city) &&
    l.price >= p.minPrice &&
    l.price <= p.maxPrice &&
    l.beds >= p.minBeds &&
    l.baths >= p.minBaths &&
    (p.types.length === 0 || p.types.includes(l.type)) &&
    p.mustHaves.every((f) => l.features.includes(f))
  )
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** A friendly 55–99 "match %" — cheaper within budget, extra beds and perks score higher. */
export function matchScore(l: Listing, p: Prefs) {
  const span = Math.max(p.maxPrice - p.minPrice, 1)
  const budgetFit = 1 - Math.min(Math.max((l.price - p.minPrice) / span, 0), 1)
  let s = 62 + budgetFit * 14
  s += Math.min(Math.max(l.beds - p.minBeds, 0), 2) * 3
  s += Math.min(l.features.length, 5) * 1.5
  s += hash(l.id) % 9
  return Math.round(Math.min(Math.max(s, 55), 99))
}
