import type { Listing, Mode, Prefs } from '../types'
import { analyze, defaultInputs } from './invest'

export const APP_NAME = 'House Bubble'

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

export const priceLabel = (l: Listing) => (l.mode === 'rent' ? `${money(l.price)}/mo` : money(l.price))

export const compactMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 ? 2 : 0)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : money(n)

/** Owner's monthly cost: 20% down, 6.5% 30-yr fixed, local tax + insurance, plus HOA. */
export function monthlyPayment(l: Listing) {
  if (l.mode === 'rent') return l.price
  const ownerCosts = ['Mortgage (P&I)', 'Property tax', 'Insurance', 'HOA']
  return analyze(l, defaultInputs(l))
    .expenses.filter((e) => ownerCosts.includes(e.label))
    .reduce((s, e) => s + e.amount, 0)
}

export const PRICE_BOUNDS: Record<Mode, { min: number; max: number; step: number }> = {
  buy: { min: 0, max: 3_000_000, step: 25_000 },
  rent: { min: 0, max: 6_000, step: 100 },
}

export const defaultPrefs = (mode: Mode = 'buy'): Prefs => ({
  mode,
  city: 'Any',
  minPrice: PRICE_BOUNDS[mode].min,
  maxPrice: PRICE_BOUNDS[mode].max,
  minBeds: 0,
  minBaths: 0,
  types: [],
  mustHaves: [],
})
