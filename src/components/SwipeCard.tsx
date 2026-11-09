import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Bath, BedDouble, Info, MapPin, Ruler } from 'lucide-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { priceLabel } from '../lib/format'
import type { ScoredListing } from '../store/useAppStore'
import type { SwipeDir } from '../types'
import { Photo } from './Photo'

export interface SwipeCardHandle {
  swipe: (dir: SwipeDir) => void
}

interface Props {
  listing: ScoredListing
  isTop: boolean
  depth: number
  onSwipe: (dir: SwipeDir) => void
  onOpen: () => void
}

const SWIPE_DISTANCE = 110
const SWIPE_VELOCITY = 600

export const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard({ listing, isTop, depth, onSwipe, onOpen }, ref) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-16, 16])
  const likeOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1])
  const nopeOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0])
  const tourOpacity = useTransform(y, [-SWIPE_DISTANCE - 20, -30], [1, 0])
  const [photo, setPhoto] = useState(0)
  const leaving = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const fly = (dir: SwipeDir) => {
    if (leaving.current) return
    leaving.current = true
    const tx = dir === 'right' ? 650 : dir === 'left' ? -650 : x.get()
    const ty = dir === 'up' ? -900 : y.get() + 40
    Promise.all([animate(x, tx, { duration: 0.32, ease: 'easeIn' }), animate(y, ty, { duration: 0.32, ease: 'easeIn' })]).then(() =>
      onSwipe(dir),
    )
  }

  useImperativeHandle(ref, () => ({ swipe: fly }))

  const handleTap = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const el = cardRef.current
    if (!el || !('clientX' in e)) return onOpen()
    const rect = el.getBoundingClientRect()
    const rx = (e.clientX - rect.left) / rect.width
    const ry = (e.clientY - rect.top) / rect.height
    if (ry > 0.68) return onOpen()
    if (rx < 0.3) setPhoto((p) => Math.max(p - 1, 0))
    else if (rx > 0.7) setPhoto((p) => Math.min(p + 1, listing.photos.length - 1))
    else onOpen()
  }

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ scale: 1 - depth * 0.05, y: depth * 14 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <motion.div
        ref={cardRef}
        className={`absolute inset-0 touch-none ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={isTop ? { x, y, rotate } : undefined}
        drag={isTop}
        dragElastic={0.9}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const { offset, velocity } = info
          if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) fly('right')
          else if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) fly('left')
          else if (offset.y < -SWIPE_DISTANCE || velocity.y < -SWIPE_VELOCITY) fly('up')
          else {
            animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
            animate(y, 0, { type: 'spring', stiffness: 500, damping: 30 })
          }
        }}
        onTap={isTop ? handleTap : undefined}
      >
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-neutral-200 shadow-card">
          <Photo src={listing.photos[photo]} alt={listing.address} className="absolute inset-0 h-full w-full" />
  
          {/* photo progress */}
          <div className="absolute inset-x-3 top-3 flex gap-1.5">
            {listing.photos.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i === photo ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
  
          <div className="absolute left-3 top-7 rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-coral-600 shadow">
            {listing.score}% match
          </div>
          {listing.daysOnMarket <= 3 && (
            <div className="absolute right-3 top-7 rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white shadow">
              New
            </div>
          )}
  
          {/* stamps */}
          {isTop && (
            <>
              <motion.div style={{ opacity: likeOpacity }} className="absolute left-6 top-20 -rotate-12 rounded-xl border-4 border-emerald-400 px-3 py-1 text-4xl font-black tracking-wider text-emerald-400">
                LIKE
              </motion.div>
              <motion.div style={{ opacity: nopeOpacity }} className="absolute right-6 top-20 rotate-12 rounded-xl border-4 border-rose-500 px-3 py-1 text-4xl font-black tracking-wider text-rose-500">
                NOPE
              </motion.div>
              <motion.div style={{ opacity: tourOpacity }} className="absolute bottom-48 left-1/2 -translate-x-1/2 -rotate-6 rounded-xl border-4 border-sky-400 px-3 py-1 text-4xl font-black tracking-wider text-sky-400">
                TOUR!
              </motion.div>
            </>
          )}
  
          {/* info */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-5 pb-5 pt-24 text-white">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="text-3xl font-black leading-tight">{priceLabel(listing)}</div>
                <div className="truncate text-lg font-bold">{listing.address}</div>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <MapPin className="h-3.5 w-3.5" /> {listing.neighborhood}, {listing.city}
                </div>
              </div>
              <Info className="h-6 w-6 shrink-0 opacity-80" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur"><BedDouble className="h-4 w-4" />{listing.beds} bd</span>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur"><Bath className="h-4 w-4" />{listing.baths} ba</span>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur"><Ruler className="h-4 w-4" />{listing.sqft.toLocaleString()} sqft</span>
              <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">{listing.type}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})
