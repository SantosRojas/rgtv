import type { Channel } from '../../../core/channel/domain/channel.ts'
import { Badge } from '../atoms/badge.tsx'
import { Icon } from '../atoms/icon.tsx'

interface ChannelCardProps {
  channel: Channel
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onSelect: (channel: Channel) => void
}

export function ChannelCard({ channel, isFavorite, onToggleFavorite, onSelect }: ChannelCardProps) {
  return (
    <button
      onClick={() => onSelect(channel)}
      className="w-full text-left bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-3 hover:border-[var(--color-accent-primary)]/50 transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {channel.logo ? (
            <img src={channel.logo} alt="" className="w-full h-full object-contain" loading="lazy" />
          ) : (
            <Icon name="tv-icon" size={24} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
            {channel.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant="category">{channel.category}</Badge>
            <Badge>{channel.country}</Badge>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(channel.id)
          }}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon
            name={isFavorite ? 'heart-filled-icon' : 'heart-icon'}
            size={18}
            className={isFavorite ? 'text-amber-400' : 'text-[var(--color-text-secondary)]'}
          />
        </button>
      </div>
    </button>
  )
}
