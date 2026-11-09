import { motion } from 'framer-motion'
import { Bath, BedDouble, Calendar, ChevronDown, Clock, Heart, Home, MapPin, MessageCircle, Phone, Ruler, Star, Wallet, X } from 'lucide-react'
import { agentFor } from '../data/listings'
import { money, monthlyPayment, priceLabel } from '../lib/format'
import type { Listing, SwipeDir } from '../types'
import { Photo } from './Photo'

interface Props {
  listing: Listing & { score?: number }
  onClose: () => void
  /** Present when opened from the swipe deck — lets you swipe from the detail view. */
  onSwipe?: (dir: SwipeDir) => void
  onRequestTour: () => void
  tourRequested: boolean
}

function Fact({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3">
      <Icon className="h-5 w-5 shrink-0 text-coral-500" />
      <div className="min-w-0">
        <div className="text-xs font-semibold text-neutral-500">{label}</div>
        <div className="truncate font-extrabold text-neutral-800">{value}</div>
      </div>
    </div>
  )
}

export function ListingDetail({ listing: l, onClose, onSwipe, onRequestTour, tourRequested }: Props) {
  const agent = agentFor(l)
  const initials = agent.name.split(' ').map((p) => p[0]).join('')
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col bg-white"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <div className="relative min-h-0 flex-1 overflow-y-auto pb-28">
        <div className="flex snap-x snap-mandatory overflow-x-auto">
          {l.photos.map((src, i) => (
            <Photo key={i} src={src} alt={`${l.address} photo ${i + 1}`} className="h-72 w-full shrink-0 snap-center" />
          ))}
        </div>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
          <ChevronDown className="h-6 w-6" />
        </button>
        <div className="absolute left-4 top-[15.5rem] rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white">
          {l.photos.length} photos · swipe →
        </div>

        <div className="space-y-6 p-5">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-neutral-900">{priceLabel(l)}</div>
              {l.score !== undefined && (
                <div className="rounded-full bg-coral-50 px-3 py-1 text-sm font-extrabold text-coral-600">{l.score}% match</div>
              )}
            </div>
            <div className="mt-1 text-lg font-bold text-neutral-800">{l.address}</div>
            <div className="flex items-center gap-1 text-neutral-500">
              <MapPin className="h-4 w-4" /> {l.neighborhood}, {l.city}, {l.state}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Fact icon={BedDouble} label="Bedrooms" value={`${l.beds}`} />
            <Fact icon={Bath} label="Bathrooms" value={`${l.baths}`} />
            <Fact icon={Ruler} label="Living area" value={`${l.sqft.toLocaleString()} sqft`} />
            <Fact icon={Home} label="Type" value={l.type} />
            <Fact icon={Calendar} label="Year built" value={`${l.yearBuilt}`} />
            <Fact icon={Clock} label="On market" value={`${l.daysOnMarket} day${l.daysOnMarket === 1 ? '' : 's'}`} />
            <Fact icon={Wallet} label={l.mode === 'rent' ? 'Monthly rent' : 'Est. monthly'} value={`${money(monthlyPayment(l))}/mo`} />
            <Fact icon={Wallet} label="HOA" value={l.hoa ? `${money(l.hoa)}/mo` : 'None'} />
          </div>

          <div>
            <h3 className="mb-2 text-lg font-black text-neutral-900">About this home</h3>
            <p className="leading-relaxed text-neutral-600">
              {l.blurb} This {l.beds}-bed, {l.baths}-bath {l.type.toLowerCase()} offers {l.sqft.toLocaleString()} square feet in one of{' '}
              {l.city}'s most-loved neighborhoods. Built in {l.yearBuilt}, it's ready for you to move in.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-black text-neutral-900">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {l.features.map((f) => (
                <span key={f} className="rounded-full bg-coral-50 px-3 py-1.5 text-sm font-bold text-coral-600">{f}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-black text-neutral-900">Location</h3>
            <div className="relative h-36 overflow-hidden rounded-2xl bg-[#e8f0e6]">
              <svg className="absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <pattern id="streets" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path d="M0 24 H48 M24 0 V48" stroke="white" strokeWidth="6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#streets)" />
                <path d="M-10 110 C 80 60, 160 140, 420 70" stroke="#a7d3f2" strokeWidth="18" fill="none" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <MapPin className="h-10 w-10 fill-coral-500 text-white drop-shadow" />
              </div>
              <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-neutral-700">{l.neighborhood}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full font-black text-white" style={{ background: agent.color }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-neutral-900">{agent.name}</div>
              <div className="text-sm text-neutral-500">{agent.brokerage}</div>
            </div>
            <a href={`tel:${agent.phone}`} aria-label="Call agent" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"><Phone className="h-4 w-4" /></a>
            <button aria-label="Message agent" className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"><MessageCircle className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-neutral-100 bg-white/95 p-4 backdrop-blur">
        {onSwipe && (
          <button onClick={() => onSwipe('left')} aria-label="Pass" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg ring-1 ring-black/5">
            <X className="h-7 w-7" strokeWidth={3} />
          </button>
        )}
        <button
          onClick={onSwipe ? () => onSwipe('up') : onRequestTour}
          disabled={!onSwipe && tourRequested}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral-500 to-bubble-500 font-extrabold text-white shadow-lg disabled:from-neutral-300 disabled:to-neutral-300"
        >
          <Star className="h-5 w-5 fill-current" /> {tourRequested ? 'Tour requested' : 'Request a tour'}
        </button>
        {onSwipe && (
          <button onClick={() => onSwipe('right')} aria-label="Like" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-emerald-500 shadow-lg ring-1 ring-black/5">
            <Heart className="h-7 w-7 fill-current" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
