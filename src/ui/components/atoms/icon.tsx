import {
  Search, Home, List, Settings, Tv,
  Play, Pause, VolumeX, Volume2, Volume1, Maximize,
  Trash2, Heart,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  'search-icon': Search,
  'home-icon': Home,
  'list-icon': List,
  'settings-icon': Settings,
  'tv-icon': Tv,
  'play-icon': Play,
  'pause-icon': Pause,
  'mute-icon': VolumeX,
  'volume-high-icon': Volume2,
  'volume-low-icon': Volume1,
  'fullscreen-icon': Maximize,
  'trash-icon': Trash2,
  'heart-icon': Heart,
  'heart-filled-icon': Heart,
}

interface IconProps {
  name: string
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  const LucideIcon = iconMap[name]
  if (!LucideIcon) return null

  return (
    <LucideIcon
      size={size}
      className={className}
      aria-hidden="true"
      {...(name === 'heart-filled-icon' ? { fill: 'currentColor' } : {})}
    />
  )
}
