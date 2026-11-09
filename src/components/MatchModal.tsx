import { motion } from 'framer-motion'
import { CalendarCheck } from 'lucide-react'
import { agentFor } from '../data/listings'
import { priceLabel } from '../lib/format'
import type { Listing } from '../types'
import { LogoMark } from './Logo'
import { Photo } from './Photo'

export function MatchModal({ listing, onTour, onClose }: { listing: Listing; onTour: () => void; onClose: () => void }) {
  const agent = agentFor(listing)
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-b from-coral-500/95 to-bubble-600/95 p-8 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h2
        className="text-5xl font-black italic tracking-tight drop-shadow"
        initial={{ scale: 0.4, rotate: -8 }}
        animate={{ scale: 1, rotate: -4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 12 }}
      >
        It's a Match!
      </motion.h2>
      <p className="mt-3 text-lg font-semibold text-white/90">
        {agent.name.split(' ')[0]} from {agent.brokerage} wants to show you this home.
      </p>

      <div className="relative my-10 flex items-center">
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 12, opacity: 1 }} transition={{ delay: 0.15, type: 'spring' }}
          className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl ring-4 ring-white">
          <LogoMark size={96} />
        </motion.div>
        <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: -12, opacity: 1 }} transition={{ delay: 0.15, type: 'spring' }}
          className="h-32 w-32 overflow-hidden rounded-full shadow-2xl ring-4 ring-white">
          <Photo src={listing.photos[0]} alt={listing.address} className="h-full w-full" />
        </motion.div>
      </div>

      <div className="text-2xl font-black">{priceLabel(listing)}</div>
      <div className="font-semibold text-white/85">{listing.address} · {listing.neighborhood}</div>

      <div className="mt-10 flex w-full flex-col gap-3">
        <button onClick={onTour} className="flex items-center justify-center gap-2 rounded-full bg-white py-4 text-lg font-extrabold text-coral-600 shadow-xl transition active:scale-95">
          <CalendarCheck className="h-5 w-5" /> Schedule a tour
        </button>
        <button onClick={onClose} className="rounded-full border-2 border-white/70 py-4 text-lg font-extrabold transition active:scale-95">
          Keep swiping
        </button>
      </div>
    </motion.div>
  )
}
