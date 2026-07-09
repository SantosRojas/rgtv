import { memo } from 'react'
import type { Channel } from '../../../core/channel/domain/channel.ts'
import { Icon } from '../atoms/icon.tsx'

interface ChannelCardProps {
  channel: Channel
  isActive: boolean
  onSelect: (channel: Channel) => void
}

export const ChannelCard = memo(function ChannelCard({ channel, isActive, onSelect }: ChannelCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(channel)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(channel)
        }
      }}
      className={`w-full aspect-square bg-[var(--glass-bg)] backdrop-blur-md border shadow-xl rounded-xl flex items-center justify-center transition-all cursor-pointer ${
        isActive
          ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/5'
          : 'border-[var(--glass-border)] hover:border-[var(--color-accent-primary)]/50'
      }`}
      title={channel.name}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
        {channel.logo ? (
          <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" loading="lazy" />
        ) : (
          <Icon name="tv-icon" size={24} />
        )}
      </div>
    </div>
  )
})
