import { Heart, RotateCcw, Star, X } from 'lucide-react'
import type { ReactNode } from 'react'

function RoundButton({ onClick, label, size, className, children, disabled }: {
  onClick: () => void
  label: string
  size: 'sm' | 'lg'
  className: string
  children: ReactNode
  disabled?: boolean
}) {
  const dim = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12'
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`${dim} flex items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 ${className}`}
    >
      {children}
    </button>
  )
}

export function ActionBar({ onUndo, onPass, onSuper, onLike, canUndo, disabled }: {
  onUndo: () => void
  onPass: () => void
  onSuper: () => void
  onLike: () => void
  canUndo: boolean
  disabled: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <RoundButton size="sm" label="Undo" onClick={onUndo} disabled={!canUndo} className="text-amber-500">
        <RotateCcw className="h-5 w-5" strokeWidth={3} />
      </RoundButton>
      <RoundButton size="lg" label="Pass (←)" onClick={onPass} disabled={disabled} className="text-rose-500">
        <X className="h-8 w-8" strokeWidth={3} />
      </RoundButton>
      <RoundButton size="sm" label="Request tour (↑)" onClick={onSuper} disabled={disabled} className="text-sky-500">
        <Star className="h-5 w-5 fill-current" />
      </RoundButton>
      <RoundButton size="lg" label="Like (→)" onClick={onLike} disabled={disabled} className="text-emerald-500">
        <Heart className="h-8 w-8 fill-current" />
      </RoundButton>
    </div>
  )
}
