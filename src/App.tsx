import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { FiltersDrawer } from './components/FiltersDrawer'
import { ListingDetail } from './components/ListingDetail'
import { Logo } from './components/Logo'
import { MatchModal } from './components/MatchModal'
import { Onboarding } from './components/Onboarding'
import { ProfileView } from './components/ProfileView'
import { SavedView } from './components/SavedView'
import { SwipeDeck, type SwipeDeckHandle } from './components/SwipeDeck'
import { defaultPrefs } from './lib/format'
import { useApp } from './store/useAppStore'
import type { Listing, Prefs } from './types'

/** Phone-sized frame: full-screen on mobile, a centered device on desktop. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-coral-50 via-pink-50 to-violet-100 sm:p-6">
      <div className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden bg-white sm:max-h-[880px] sm:rounded-[2.5rem] sm:shadow-2xl sm:ring-8 sm:ring-neutral-900">
        {children}
      </div>
    </div>
  )
}

function activeFilterCount(p: Prefs) {
  const d = defaultPrefs(p.mode)
  return (
    (p.city !== d.city ? 1 : 0) +
    (p.minPrice !== d.minPrice || p.maxPrice !== d.maxPrice ? 1 : 0) +
    (p.minBeds ? 1 : 0) +
    (p.minBaths ? 1 : 0) +
    p.types.length +
    p.mustHaves.length
  )
}

export default function App() {
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState<Tab>('discover')
  const [detail, setDetail] = useState<{ listing: Listing & { score?: number }; fromDeck: boolean } | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [match, setMatch] = useState<Listing | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const deckRef = useRef<SwipeDeckHandle>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const requestTour = (l: Listing) => {
    dispatch({ type: 'REQUEST_TOUR', id: l.id })
    setToast(`Tour requested for ${l.address} — the agent will confirm a time 📅`)
  }

  if (!state.onboarded)
    return (
      <Frame>
        <Onboarding />
      </Frame>
    )

  const filters = activeFilterCount(state.prefs)
  const title = tab === 'saved' ? 'Saved homes' : tab === 'profile' ? 'Profile' : null

  return (
    <Frame>
      <header className="flex items-center justify-between px-4 pb-3 pt-4">
        {title ? <h1 className="text-2xl font-black text-neutral-900">{title}</h1> : <Logo />}
        {tab === 'discover' && (
          <button onClick={() => setFiltersOpen(true)} aria-label="Filters" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
            <SlidersHorizontal className="h-5 w-5 text-neutral-700" />
            {filters > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[11px] font-black text-white">{filters}</span>
            )}
          </button>
        )}
      </header>

      {tab === 'discover' && (
        <SwipeDeck
          ref={deckRef}
          paused={!!detail || filtersOpen || !!match}
          onOpen={(l) => setDetail({ listing: l, fromDeck: true })}
          onMatch={setMatch}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      )}
      {tab === 'saved' && <SavedView onOpen={(l) => setDetail({ listing: l, fromDeck: false })} />}
      {tab === 'profile' && <ProfileView onOpenFilters={() => setFiltersOpen(true)} />}

      <BottomNav tab={tab} onChange={setTab} savedCount={state.liked.length} />

      <AnimatePresence>
        {detail && (
          <ListingDetail
            key="detail"
            listing={detail.listing}
            tourRequested={state.tours.includes(detail.listing.id)}
            onClose={() => setDetail(null)}
            onRequestTour={() => requestTour(detail.listing)}
            onSwipe={
              detail.fromDeck
                ? (dir) => {
                    setDetail(null)
                    setTimeout(() => deckRef.current?.swipeTop(dir), 250)
                  }
                : undefined
            }
          />
        )}
        {filtersOpen && <FiltersDrawer key="filters" onClose={() => setFiltersOpen(false)} />}
        {match && (
          <MatchModal
            key="match"
            listing={match}
            onClose={() => setMatch(null)}
            onTour={() => {
              requestTour(match)
              setMatch(null)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="absolute inset-x-4 bottom-24 z-50 rounded-2xl bg-neutral-900 px-4 py-3 text-center text-sm font-bold text-white shadow-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Frame>
  )
}
