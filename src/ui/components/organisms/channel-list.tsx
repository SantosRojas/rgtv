import { useRef } from 'react'
import type { Channel } from '../../../core/channel/domain/channel.ts'
import { ChannelCard } from '../molecules/channel-card.tsx'

interface ChannelListProps {
  channels: Channel[]
  currentChannelId: string | null
  isLoading: boolean
  onSelectChannel: (channel: Channel) => void
}

export function ChannelList({
  channels,
  currentChannelId,
  isLoading,
  onSelectChannel,
}: ChannelListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 px-1" aria-label="Cargando canales">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-xl animate-pulse"
          />
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
      <div className="grid grid-cols-3 gap-2 px-1">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isActive={channel.id === currentChannelId}
            onSelect={onSelectChannel}
          />
        ))}
      </div>
    </div>
  )
}