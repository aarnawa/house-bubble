import type { Listing } from '../types'

/** Rough market assumptions per city — swap for live data (e.g. RentCast) later. */
const MARKET: Record<string, { rentPerSqft: number; taxRate: number; insuranceRate: number; appreciation: number }> = {
  Austin: { rentPerSqft: 1.55, taxRate: 0.018, insuranceRate: 0.007, appreciation: 0.03 },
  Denver: { rentPerSqft: 1.7, taxRate: 0.0055, insuranceRate: 0.005, appreciation: 0.035 },
  Seattle: { rentPerSqft: 2.2, taxRate: 0.0095, insuranceRate: 0.0035, appreciation: 0.04 },
}

export const cityTaxRate = (l: Listing) => MARKET[l.city].taxRate

export interface InvestInputs {
  downPct: number // 0–1
  rate: number // annual, e.g. 0.065
  rent: number // monthly
  vacancyPct: number
  managementPct: number
  maintenancePct: number // of price, annual
}

/** Smaller homes rent for more per sqft; scale market rent/sqft by size. */
export function estimateRent(l: Listing) {
  if (l.rentEstimate) return l.rentEstimate
  const m = MARKET[l.city]
  const sizeFactor = Math.min(Math.max(Math.pow(1500 / l.sqft, 0.25), 0.8), 1.25)
  return Math.round((l.sqft * m.rentPerSqft * sizeFactor) / 25) * 25
}

export const defaultInputs = (l: Listing): InvestInputs => ({
  downPct: 0.2,
  rate: 0.065,
  rent: estimateRent(l),
  vacancyPct: 0.05,
  managementPct: 0.08,
  maintenancePct: 0.0075,
})

export function mortgagePayment(principal: number, annualRate: number, years = 30) {
  const r = annualRate / 12
  const n = years * 12
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n))
}

/** Remaining loan balance after `months` payments. */
function balanceAfter(principal: number, annualRate: number, months: number, years = 30) {
  const r = annualRate / 12
  const pmt = mortgagePayment(principal, annualRate, years)
  return r === 0 ? principal - pmt * months : principal * Math.pow(1 + r, months) - (pmt * (Math.pow(1 + r, months) - 1)) / r
}

export function analyze(l: Listing, i: InvestInputs) {
  const m = MARKET[l.city]
  const down = l.price * i.downPct
  const closing = l.price * 0.03
  const loan = l.price - down
  const cashNeeded = down + closing

  const mortgage = mortgagePayment(loan, i.rate)
  const expenses = [
    { label: 'Mortgage (P&I)', amount: mortgage },
    { label: 'Property tax', amount: (l.price * m.taxRate) / 12 },
    { label: 'Insurance', amount: (l.price * m.insuranceRate) / 12 },
    { label: 'HOA', amount: l.hoa },
    { label: 'Maintenance', amount: (l.price * i.maintenancePct) / 12 },
    { label: 'Vacancy', amount: i.rent * i.vacancyPct },
    { label: 'Property management', amount: i.rent * i.managementPct },
  ].filter((e) => e.amount > 0)

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const cashFlow = i.rent - totalExpenses
  const noi = (i.rent - (totalExpenses - mortgage)) * 12 // operating income before debt

  // 5-year picture: appreciation + principal paid down + cumulative cash flow
  const value5 = l.price * Math.pow(1 + m.appreciation, 5)
  const equity5 = value5 - balanceAfter(loan, i.rate, 60)
  const profit5 = equity5 - down + cashFlow * 60 - closing

  return {
    down,
    closing,
    cashNeeded,
    expenses,
    totalExpenses,
    cashFlow,
    capRate: noi / l.price,
    cashOnCash: (cashFlow * 12) / cashNeeded,
    onePercent: i.rent / l.price, // the "1% rule" target is ≥ 0.01
    breakEvenRent: i.rent - cashFlow,
    appreciation: m.appreciation,
    value5,
    equity5,
    profit5,
    roi5: profit5 / cashNeeded,
  }
}
