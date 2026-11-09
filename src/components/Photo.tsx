import { Home } from 'lucide-react'
import { useState } from 'react'

/** Image with a soft gradient placeholder if it fails to load. */
export function Photo({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-coral-100 via-pink-100 to-violet-200 ${className}`}>
        <Home className="h-12 w-12 text-coral-400" />
      </div>
    )
  return <img src={src} alt={alt} draggable={false} onError={() => setFailed(true)} className={`object-cover select-none ${className}`} />
}
