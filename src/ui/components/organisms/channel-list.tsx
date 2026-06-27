import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import type { Channel } from '../../../core/channel/domain/channel.ts'
import { ChannelCard } from '../molecules/channel-card.tsx'

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
    return (
      <div className="space-y-3 px-1" aria-label="Cargando canales">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 animate-pulse"
          >
            <div className="w-12 h-12 rounded-lg bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/4 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-(--color-text-secondary)">
        <p className="text-lg">No se encontraron canales</p>
        <p className="text-sm mt-1">Importa una lista para comenzar</p>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="h-full overflow-auto scrollbar-none" role="list" aria-label="Lista de canales">
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
