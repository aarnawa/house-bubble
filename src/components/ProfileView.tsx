import { RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react'
import { compactMoney } from '../lib/format'
import { useApp } from '../store/useAppStore'

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-3 text-center">
      <div className="text-2xl font-black text-neutral-900">{value}</div>
      <div className="text-xs font-bold text-neutral-500">{label}</div>
    </div>
  )
}

export function ProfileView({ onOpenFilters }: { onOpenFilters: () => void }) {
  const { state, dispatch } = useApp()
  const p = state.prefs
  const swiped = state.liked.length + state.passed.length
  const summary = [
    p.mode === 'buy' ? 'Buying' : 'Renting',
    p.city === 'Any' ? 'anywhere' : `in ${p.city}`,
    `${compactMoney(p.minPrice)}–${compactMoney(p.maxPrice)}`,
    p.minBeds ? `${p.minBeds}+ beds` : null,
    ...p.types,
    ...p.mustHaves,
  ].filter(Boolean)

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral-400 to-bubble-500 text-2xl font-black text-white">Y</div>
        <div>
          <div className="text-xl font-black">You</div>
          <div className="text-sm font-semibold text-neutral-500">Home hunter since today</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Swiped" value={swiped} />
        <Stat label="Liked" value={state.liked.length} />
        <Stat label="Tours" value={state.tours.length} />
      </div>

      <div className="rounded-2xl border border-neutral-100 p-4 shadow-sm">
        <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-neutral-500">Looking for</div>
        <div className="flex flex-wrap gap-2">
          {summary.map((s) => (
            <span key={s as string} className="rounded-full bg-coral-50 px-3 py-1 text-sm font-bold text-coral-600">{s}</span>
          ))}
        </div>
        <button onClick={onOpenFilters} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 py-3 font-bold text-neutral-700">
          <SlidersHorizontal className="h-4 w-4" /> Edit preferences
        </button>
      </div>

      <div className="space-y-2">
        <button onClick={() => dispatch({ type: 'RESTART_ONBOARDING' })} className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 py-3 font-bold text-neutral-700">
          <Sparkles className="h-4 w-4" /> Replay onboarding
        </button>
        <button
          onClick={() => { if (confirm('Reset all demo data?')) dispatch({ type: 'RESET_ALL' }) }}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 py-3 font-bold text-rose-500"
        >
          <RefreshCw className="h-4 w-4" /> Reset demo
        </button>
      </div>
    </div>
  )
}
