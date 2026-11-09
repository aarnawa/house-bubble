import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { LISTINGS } from '../data/listings'
import { defaultPrefs } from '../lib/format'
import { matchesPrefs, matchScore } from '../lib/match'
import type { Listing, Prefs, SwipeDir } from '../types'

export interface AppState {
  onboarded: boolean
  prefs: Prefs
  liked: string[]
  passed: string[]
  matched: string[]
  tours: string[]
  history: { id: string; dir: SwipeDir; matched: boolean }[]
}

export type Action =
  | { type: 'FINISH_ONBOARDING'; prefs: Prefs }
  | { type: 'SET_PREFS'; prefs: Prefs }
  | { type: 'SWIPE'; id: string; dir: SwipeDir; matched: boolean }
  | { type: 'UNDO' }
  | { type: 'REQUEST_TOUR'; id: string }
  | { type: 'UNSAVE'; id: string }
  | { type: 'RESET_DECK' }
  | { type: 'RESTART_ONBOARDING' }
  | { type: 'RESET_ALL' }

const STORAGE_KEY = 'house-bubble-v1'

const initialState: AppState = {
  onboarded: false,
  prefs: defaultPrefs(),
  liked: [],
  passed: [],
  matched: [],
  tours: [],
  history: [],
}

const without = (list: string[], id: string) => list.filter((x) => x !== id)
const add = (list: string[], id: string) => (list.includes(id) ? list : [...list, id])

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'FINISH_ONBOARDING':
      return { ...state, onboarded: true, prefs: action.prefs }
    case 'SET_PREFS':
      return { ...state, prefs: action.prefs }
    case 'SWIPE': {
      const { id, dir, matched } = action
      const liked = dir === 'left' ? state.liked : add(state.liked, id)
      const passed = dir === 'left' ? add(state.passed, id) : state.passed
      return {
        ...state,
        liked,
        passed,
        matched: matched ? add(state.matched, id) : state.matched,
        history: [...state.history, { id, dir, matched }].slice(-50),
      }
    }
    case 'UNDO': {
      const last = state.history[state.history.length - 1]
      if (!last) return state
      return {
        ...state,
        liked: without(state.liked, last.id),
        passed: without(state.passed, last.id),
        matched: last.matched ? without(state.matched, last.id) : state.matched,
        tours: last.matched ? without(state.tours, last.id) : state.tours,
        history: state.history.slice(0, -1),
      }
    }
    case 'REQUEST_TOUR':
      return { ...state, tours: add(state.tours, action.id), matched: add(state.matched, action.id) }
    case 'UNSAVE':
      return {
        ...state,
        liked: without(state.liked, action.id),
        matched: without(state.matched, action.id),
        tours: without(state.tours, action.id),
        history: state.history.filter((h) => h.id !== action.id),
      }
    case 'RESET_DECK':
      return { ...state, passed: [], history: state.history.filter((h) => h.dir !== 'left') }
    case 'RESTART_ONBOARDING':
      return { ...state, onboarded: false }
    case 'RESET_ALL':
      return initialState
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    // storage unavailable or corrupt — start fresh
  }
  return initialState
}

const Ctx = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export interface ScoredListing extends Listing {
  score: number
}

/** Listings that fit the current prefs and haven't been swiped yet, best match first. */
export function useDeck(): ScoredListing[] {
  const { state } = useApp()
  return useMemo(() => {
    const seen = new Set([...state.liked, ...state.passed])
    return LISTINGS.filter((l) => !seen.has(l.id) && matchesPrefs(l, state.prefs))
      .map((l) => ({ ...l, score: matchScore(l, state.prefs) }))
      .sort((a, b) => b.score - a.score)
  }, [state.liked, state.passed, state.prefs])
}

export const listingById = (id: string) => LISTINGS.find((l) => l.id === id)
