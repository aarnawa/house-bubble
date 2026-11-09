import { PartyPopper, SlidersHorizontal } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useApp, useDeck, type ScoredListing } from '../store/useAppStore'
import type { Listing, SwipeDir } from '../types'
import { ActionBar } from './ActionBar'
import { SwipeCard, type SwipeCardHandle } from './SwipeCard'

export interface SwipeDeckHandle {
  swipeTop: (dir: SwipeDir) => void
}

interface Props {
  onOpen: (l: ScoredListing) => void
  onMatch: (l: Listing) => void
  onOpenFilters: () => void
  paused: boolean
}

const MATCH_CHANCE = 0.3

export const SwipeDeck = forwardRef<SwipeDeckHandle, Props>(function SwipeDeck({ onOpen, onMatch, onOpenFilters, paused }, ref) {
  const { state, dispatch } = useApp()
  const deck = useDeck()
  const topRef = useRef<SwipeCardHandle>(null)
  const top = deck[0]

  const handleSwipe = (l: Listing, dir: SwipeDir) => {
    const matched = dir === 'up' || (dir === 'right' && Math.random() < MATCH_CHANCE)
    dispatch({ type: 'SWIPE', id: l.id, dir, matched })
    if (matched) onMatch(l)
  }

  const swipeTop = (dir: SwipeDir) => topRef.current?.swipe(dir)
  useImperativeHandle(ref, () => ({ swipeTop }))

  useEffect(() => {
    if (paused) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') swipeTop('left')
      else if (e.key === 'ArrowRight') swipeTop('right')
      else if (e.key === 'ArrowUp') swipeTop('up')
      else if (e.key === 'Backspace' || (e.key === 'z' && (e.metaKey || e.ctrlKey))) dispatch({ type: 'UNDO' })
      else if (e.key === 'Enter' && top) onOpen(top)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const where = state.prefs.city === 'Any' ? 'your area' : state.prefs.city

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3">
      <div className="relative min-h-0 flex-1">
        {top ? (
          deck
            .slice(0, 3)
            .map((l, i) => (
              <SwipeCard
                key={l.id}
                ref={i === 0 ? topRef : undefined}
                listing={l}
                isTop={i === 0}
                depth={i}
                onSwipe={(dir) => handleSwipe(l, dir)}
                onOpen={() => onOpen(l)}
              />
            ))
            .reverse()
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-coral-100 bg-white p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coral-50">
              <PartyPopper className="h-10 w-10 text-coral-500" />
            </div>
            <h2 className="text-2xl font-black text-neutral-800">You've seen every home in {where}!</h2>
            <p className="text-neutral-500">Widen your filters or take another look at the ones you passed on.</p>
            <div className="flex w-full flex-col gap-2">
              <button onClick={onOpenFilters} className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral-500 to-bubble-500 py-3 font-extrabold text-white shadow-lg">
                <SlidersHorizontal className="h-4 w-4" /> Widen filters
              </button>
              <button
                onClick={() => dispatch({ type: 'RESET_DECK' })}
                disabled={state.passed.length === 0}
                className="rounded-full bg-neutral-100 py-3 font-bold text-neutral-700 disabled:opacity-40"
              >
                Show passed homes again ({state.passed.length})
              </button>
            </div>
          </div>
        )}
      </div>
      <ActionBar
        canUndo={state.history.length > 0}
        disabled={!top}
        onUndo={() => dispatch({ type: 'UNDO' })}
        onPass={() => swipeTop('left')}
        onSuper={() => swipeTop('up')}
        onLike={() => swipeTop('right')}
      />
    </div>
  )
})
