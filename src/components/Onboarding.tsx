import { useState } from 'react'
import { useApp } from '../store/useAppStore'
import { Logo } from './Logo'
import { PrefControls } from './PrefControls'

export function Onboarding() {
  const { state, dispatch } = useApp()
  const [prefs, setPrefs] = useState(state.prefs)
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-10">
        <Logo size={40} />
        <h1 className="mt-8 text-4xl font-black leading-tight text-neutral-900">
          Swipe right on your <span className="bg-gradient-to-r from-coral-500 to-bubble-500 bg-clip-text text-transparent">next home.</span>
        </h1>
        <p className="mt-3 text-lg text-neutral-500">Tell us a little about what you're looking for. We'll do the rest.</p>
        <div className="mt-8">
          <PrefControls prefs={prefs} onChange={setPrefs} compact />
        </div>
      </div>
      <div className="space-y-2 border-t border-neutral-100 p-5">
        <button
          onClick={() => dispatch({ type: 'FINISH_ONBOARDING', prefs })}
          className="w-full rounded-full bg-gradient-to-r from-coral-500 to-bubble-500 py-4 text-lg font-extrabold text-white shadow-lg transition active:scale-95"
        >
          Start swiping
        </button>
        <button onClick={() => dispatch({ type: 'FINISH_ONBOARDING', prefs: state.prefs })} className="w-full py-2 text-sm font-bold text-neutral-400">
          Skip for now
        </button>
      </div>
    </div>
  )
}
