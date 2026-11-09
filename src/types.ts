export type Mode = 'buy' | 'rent'
export type PropertyType = 'House' | 'Condo' | 'Townhouse' | 'Apartment'
export type SwipeDir = 'left' | 'right' | 'up'

export interface Agent {
  id: string
  name: string
  brokerage: string
  phone: string
  color: string
}

export interface Listing {
  id: string
  address: string
  neighborhood: string
  city: string
  state: string
  mode: Mode
  type: PropertyType
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  hoa: number
  daysOnMarket: number
  photos: string[]
  blurb: string
  features: string[]
  agentId: string
  /** Known market rent (e.g. multi-unit); otherwise estimated from size + city. */
  rentEstimate?: number
}

export interface Prefs {
  mode: Mode
  city: string // 'Any' or a city name
  minPrice: number
  maxPrice: number
  minBeds: number
  minBaths: number
  types: PropertyType[]
  mustHaves: string[]
}
