import { APP_NAME } from '../lib/format'

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id="hb-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7a6b" />
          <stop offset="1" stopColor="#ff3d8b" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#hb-g)" />
      <circle cx="16" cy="14" r="4" fill="white" opacity="0.35" />
      <path d="M14 25 L24 16 L34 25 V34 a2 2 0 0 1 -2 2 H28 V29 H20 V36 H16 a2 2 0 0 1 -2 -2 Z" fill="white" />
    </svg>
  )
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={size} />
      <span className="text-xl font-black tracking-tight bg-gradient-to-r from-coral-500 to-bubble-500 bg-clip-text text-transparent">
        {APP_NAME}
      </span>
    </div>
  )
}
