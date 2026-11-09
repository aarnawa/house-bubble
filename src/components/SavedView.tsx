import { CalendarCheck, Heart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { priceLabel } from '../lib/format'
import { listingById, useApp } from '../store/useAppStore'
import type { Listing } from '../types'
import { Photo } from './Photo'

export function SavedView({ onOpen }: { onOpen: (l: Listing) => void }) {
  const { state, dispatch } = useApp()
  const [seg, setSeg] = useState<'liked' | 'matches'>('liked')
  const ids = seg === 'liked' ? state.liked : state.matched
  const items = [...ids].reverse().map(listingById).filter((l): l is Listing => !!l)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
          {(['liked', 'matches'] as const).map((s) => (
            <button key={s} onClick={() => setSeg(s)} className={`rounded-full py-2 text-sm font-extrabold capitalize transition ${seg === s ? 'bg-white text-coral-600 shadow' : 'text-neutral-500'}`}>
              {s} ({(s === 'liked' ? state.liked : state.matched).length})
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-neutral-500">
            <Heart className="h-12 w-12 text-coral-100" />
            <p className="font-bold">{seg === 'liked' ? 'Homes you like will show up here.' : 'No matches yet. Keep swiping, or tap ★ to request a tour.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((l) => {
              const toured = state.tours.includes(l.id)
              return (
                <div key={l.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
                  <button onClick={() => onOpen(l)} className="block w-full text-left">
                    <Photo src={l.photos[0]} alt={l.address} className="h-32 w-full" />
                    <div className="p-2.5">
                      <div className="font-black text-neutral-900">{priceLabel(l)}</div>
                      <div className="truncate text-xs font-semibold text-neutral-500">{l.beds} bd · {l.baths} ba · {l.neighborhood}</div>
                      {state.matched.includes(l.id) && (
                        <div className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${toured ? 'bg-emerald-50 text-emerald-600' : 'bg-coral-50 text-coral-600'}`}>
                          <CalendarCheck className="h-3 w-3" /> {toured ? 'Tour requested' : 'Matched'}
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'UNSAVE', id: l.id })}
                    aria-label="Remove"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 shadow"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
