import { LISTINGS } from '../data/listings'
import type { Listing } from '../types'
import { compactMoney, money } from './format'
import { analyze, cityTaxRate, defaultInputs } from './invest'

const clamp = (n: number, lo = 1, hi = 10) => Math.min(Math.max(n, lo), hi)
const ppsf = (l: Listing) => l.price / l.sqft

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Median $/sqft (or rent/sqft) among comparable listings in the same city. */
const cityMedianPpsf = (l: Listing) => median(LISTINGS.filter((x) => x.city === l.city && x.mode === l.mode).map(ppsf))

export interface SubScore {
  label: string
  score: number
  note: string
}

export interface HouseRating {
  overall: number
  grade: string
  subscores: SubScore[]
  pros: string[]
  cons: string[]
}

const gradeFor = (s: number) => (s >= 8.5 ? 'Excellent' : s >= 7.5 ? 'Great' : s >= 6.5 ? 'Good' : s >= 5 ? 'Fair' : 'Below average')

const BUYER_FAVORITES = ['Yard', 'Garage', 'Pool', 'View', 'Home office', 'Fireplace']

export function rateListing(l: Listing): HouseRating {
  const buy = l.mode === 'buy'
  const mine = ppsf(l)
  const med = cityMedianPpsf(l)
  const vsMedian = (mine - med) / med // negative = cheaper than median
  const fmtPpsf = (n: number) => (buy ? money(n) : `$${n.toFixed(2)}`)
  const renovated = /restored|updated|remodeled/i.test(l.blurb)
  const tax = cityTaxRate(l)
  const inv = buy ? analyze(l, defaultInputs(l)) : null

  const ageScore =
    (l.yearBuilt >= 2015 ? 9.5 : l.yearBuilt >= 2000 ? 8 : l.yearBuilt >= 1980 ? 6.5 : l.yearBuilt >= 1950 ? 5.5 : 4.5) + (renovated ? 1.5 : 0)

  const subscores: SubScore[] = [
    { label: 'Value', score: clamp(5 - vsMedian * 10), note: `${fmtPpsf(mine)}/sqft vs ${fmtPpsf(med)} city median` },
    { label: 'Space', score: clamp(2 + l.sqft / 450 + l.beds * 0.3), note: `${l.sqft.toLocaleString()} sqft · ${l.beds} bd / ${l.baths} ba` },
    { label: 'Condition', score: clamp(ageScore), note: `Built ${l.yearBuilt}${renovated ? ', renovated' : ''}` },
    { label: 'Features', score: clamp(3 + l.features.length * 1.3), note: l.features.slice(0, 3).join(', ') },
  ]
  if (buy) {
    subscores.push(
      { label: 'Carrying costs', score: clamp(10 - l.hoa / 120 - (tax >= 0.015 ? 2 : tax >= 0.009 ? 1 : 0)), note: `${l.hoa ? `${money(l.hoa)}/mo HOA` : 'No HOA'} · ${(tax * 100).toFixed(2)}% tax` },
      { label: 'Investment', score: clamp(inv!.capRate * 100 * 1.4 + 1.5), note: `${(inv!.capRate * 100).toFixed(1)}% cap rate as a rental` },
    )
  }
  const weights = buy ? [0.25, 0.15, 0.15, 0.15, 0.15, 0.15] : [0.4, 0.2, 0.2, 0.2]
  const overall = Math.round(subscores.reduce((s, x, i) => s + x.score * weights[i], 0) * 10) / 10
  subscores.forEach((s) => (s.score = Math.round(s.score * 10) / 10))

  const pros: string[] = []
  const cons: string[] = []
  const pct = Math.round(Math.abs(vsMedian) * 100)
  const priceWord = buy ? 'Priced' : 'Rent is'

  if (vsMedian <= -0.08) pros.push(`${priceWord} ${pct}% below the ${l.city} median per sq ft`)
  if (vsMedian >= 0.15) cons.push(`${priceWord} ${pct}% above the ${l.city} median per sq ft`)
  if (l.features.includes('Income unit')) pros.push('Built-in rental income to help pay the mortgage')
  if (inv && inv.cashFlow > 0) pros.push(`Cash-flows about +${money(inv.cashFlow)}/mo as a rental`)
  if (inv && inv.roi5 >= 0.3) pros.push(`Strong 5-yr upside: ~${Math.round(inv.roi5 * 100)}% return on cash invested`)
  if (l.yearBuilt >= 2010) pros.push(`Newer construction (${l.yearBuilt}) — fewer big repairs ahead`)
  else if (renovated) pros.push('Recently updated — character without the fixer-upper work')
  if (buy && l.hoa === 0) pros.push('No HOA fees or rules')
  if (buy && tax < 0.007) pros.push(`Low property taxes (~${(tax * 100).toFixed(2)}%/yr)`)
  const favs = l.features.filter((f) => BUYER_FAVORITES.includes(f))
  if (favs.length >= 2) pros.push(`Buyer favorites: ${favs.join(', ')}`)
  if (l.beds >= 4) pros.push(`Room to grow with ${l.beds} bedrooms`)
  if (l.daysOnMarket >= 14) pros.push(`On market ${l.daysOnMarket} days — likely room to negotiate`)

  if (l.hoa >= 300) cons.push(`High HOA: ${money(l.hoa)}/mo (${compactMoney(l.hoa * 12)}/yr)`)
  if (l.yearBuilt < 1950 && !renovated) cons.push(`Older home (${l.yearBuilt}) — budget for inspection & updates`)
  if (buy && tax >= 0.015) cons.push(`High property taxes (~${(tax * 100).toFixed(1)}%/yr ≈ ${money((l.price * tax) / 12)}/mo)`)
  if (inv && inv.cashFlow < 0) cons.push(`Would lose ~${money(-inv.cashFlow)}/mo as a rental at today's rates`)
  if (l.daysOnMarket <= 3) cons.push('Just listed — expect competing offers')
  if (l.sqft < 800) cons.push(`Compact at ${l.sqft} sq ft`)

  return { overall, grade: gradeFor(overall), subscores, pros, cons }
}
