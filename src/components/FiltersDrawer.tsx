import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { LISTINGS } from '../data/listings'
import { defaultPrefs } from '../lib/format'
import { matchesPrefs } from '../lib/match'
import { useApp } from '../store/useAppStore'
import { PrefControls } from './PrefControls'

export function FiltersDrawer({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useApp()
  const [draft, setDraft] = useState(state.prefs)
  const count = useMemo(() => {
    const seen = new Set([...state.liked, ...state.passed])
    return LISTINGS.filter((l) => !seen.has(l.id) && matchesPrefs(l, draft)).length
  }, [draft, state.liked, state.passed])

  return (
    <motion.div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="flex max-h-[88%] flex-col rounded-t-3xl bg-white"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <button onClick={() => setDraft(defaultPrefs(draft.mode))} className="text-sm font-bold text-neutral-500">Reset</button>
          <h2 className="text-lg font-black">Filters</h2>
          <button onClick={onClose} aria-label="Close"><X className="h-6 w-6" /></button>
        </div>
        <div className="overflow-y-auto p-5">
          <PrefControls prefs={draft} onChange={setDraft} />
        </div>
        <div className="border-t border-neutral-100 p-4">
          <button
            onClick={() => { dispatch({ type: 'SET_PREFS', prefs: draft }); onClose() }}
            className="w-full rounded-full bg-gradient-to-r from-coral-500 to-bubble-500 py-4 text-lg font-extrabold text-white shadow-lg"
          >
            Show {count} home{count === 1 ? '' : 's'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
