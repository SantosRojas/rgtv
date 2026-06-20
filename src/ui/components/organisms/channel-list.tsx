import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import type { Channel } from '../../../core/channel/domain/channel.ts'
import { ChannelCard } from '../molecules/channel-card.tsx'
import { LoadingSpinner } from '../atoms/loading-spinner.tsx'

interface ChannelListProps {
  channels: Channel[]
  favoriteIds: string[]
  isLoading: boolean
  onToggleFavorite: (id: string) => void
  onSelectChannel: (channel: Channel) => void
}

export function ChannelList({
  channels,
  favoriteIds,
  isLoading,
  onToggleFavorite,
  onSelectChannel,
}: ChannelListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: channels.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  })

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-12" />
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)]">
        <p className="text-lg">No channels found</p>
        <p className="text-sm mt-1">Import a playlist to get started</p>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-220px)] overflow-auto" role="list" aria-label="Channel list">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const channel = channels[virtualItem.index]
          if (!channel) return null
          return (
            <div
              key={channel.id}
              className="absolute top-0 left-0 w-full px-1"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ChannelCard
                channel={channel}
                isFavorite={favoriteIds.includes(channel.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectChannel}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
