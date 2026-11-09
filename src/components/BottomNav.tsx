import { Flame, Heart, User } from 'lucide-react'

export type Tab = 'discover' | 'saved' | 'profile'

const ITEMS = [
  { id: 'discover', label: 'Discover', icon: Flame },
  { id: 'saved', label: 'Saved', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
] as const

export function BottomNav({ tab, onChange, savedCount }: { tab: Tab; onChange: (t: Tab) => void; savedCount: number }) {
  return (
    <nav className="flex border-t border-neutral-100 bg-white pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map(({ id, label, icon: Icon }) => {
        const active = tab === id
        return (
          <button key={id} onClick={() => onChange(id)} className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${active ? 'text-coral-500' : 'text-neutral-400'}`}>
            <Icon className={`h-6 w-6 ${active ? 'fill-current' : ''}`} />
            {label}
            {id === 'saved' && savedCount > 0 && (
              <span className="absolute left-1/2 top-1 ml-2 rounded-full bg-bubble-500 px-1.5 text-[10px] font-black text-white">{savedCount}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
