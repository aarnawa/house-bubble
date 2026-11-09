import { CITIES, MUST_HAVES } from '../data/listings'
import { compactMoney, defaultPrefs, PRICE_BOUNDS } from '../lib/format'
import type { Prefs, PropertyType } from '../types'

const TYPES: PropertyType[] = ['House', 'Townhouse', 'Condo', 'Apartment']

export function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active ? 'bg-gradient-to-r from-coral-500 to-bubble-500 text-white shadow' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      }`}
    >
      {children}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-neutral-500">{title}</div>
      {children}
    </div>
  )
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

/** Shared preference editor used by onboarding and the filters drawer. */
export function PrefControls({ prefs, onChange, compact = false }: { prefs: Prefs; onChange: (p: Prefs) => void; compact?: boolean }) {
  const bounds = PRICE_BOUNDS[prefs.mode]
  const set = (patch: Partial<Prefs>) => onChange({ ...prefs, ...patch })
  const maxLabel = prefs.maxPrice >= bounds.max ? `${compactMoney(bounds.max)}+` : compactMoney(prefs.maxPrice)

  return (
    <div className="space-y-6">
      <Section title="I want to">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-neutral-100 p-1">
          {(['buy', 'rent'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => m !== prefs.mode && onChange({ ...defaultPrefs(m), city: prefs.city, minBeds: prefs.minBeds })}
              className={`rounded-full py-2.5 font-extrabold capitalize transition ${prefs.mode === m ? 'bg-white text-coral-600 shadow' : 'text-neutral-500'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Where">
        <div className="flex flex-wrap gap-2">
          {['Any', ...CITIES].map((c) => (
            <Pill key={c} active={prefs.city === c} onClick={() => set({ city: c })}>{c === 'Any' ? 'Anywhere' : c}</Pill>
          ))}
        </div>
      </Section>

      <Section title={`Budget · ${compactMoney(prefs.minPrice)} – ${maxLabel}${prefs.mode === 'rent' ? '/mo' : ''}`}>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-neutral-500">
            <span className="w-8">Min</span>
            <input type="range" className="flex-1 accent-coral-500" min={bounds.min} max={bounds.max} step={bounds.step} value={prefs.minPrice}
              onChange={(e) => { const v = +e.target.value; set({ minPrice: v, maxPrice: Math.max(v, prefs.maxPrice) }) }} />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-neutral-500">
            <span className="w-8">Max</span>
            <input type="range" className="flex-1 accent-coral-500" min={bounds.min} max={bounds.max} step={bounds.step} value={prefs.maxPrice}
              onChange={(e) => { const v = +e.target.value; set({ maxPrice: v, minPrice: Math.min(v, prefs.minPrice) }) }} />
          </label>
        </div>
      </Section>

      <Section title="Bedrooms">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <Pill key={n} active={prefs.minBeds === n} onClick={() => set({ minBeds: n })}>{n === 0 ? 'Any' : `${n}+`}</Pill>
          ))}
        </div>
      </Section>

      {!compact && (
        <>
          <Section title="Bathrooms">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((n) => (
                <Pill key={n} active={prefs.minBaths === n} onClick={() => set({ minBaths: n })}>{n === 0 ? 'Any' : `${n}+`}</Pill>
              ))}
            </div>
          </Section>
          <Section title="Home type">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Pill key={t} active={prefs.types.includes(t)} onClick={() => set({ types: toggle(prefs.types, t) })}>{t}</Pill>
              ))}
            </div>
          </Section>
          <Section title="Must-haves">
            <div className="flex flex-wrap gap-2">
              {MUST_HAVES.map((f) => (
                <Pill key={f} active={prefs.mustHaves.includes(f)} onClick={() => set({ mustHaves: toggle(prefs.mustHaves, f) })}>{f}</Pill>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
