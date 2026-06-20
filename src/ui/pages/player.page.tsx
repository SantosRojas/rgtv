import { useEffect } from 'react'
import { useChannels } from '../hooks/use-channels.ts'
import { Player } from '../components/organisms/player.tsx'
import { LoadingSpinner } from '../components/atoms/loading-spinner.tsx'
import { Badge } from '../components/atoms/badge.tsx'
import { usePlayerStore } from '../../stores/player.store.ts'

interface PlayerPageProps {
  channelId: string | undefined
}

export default function PlayerPage({ channelId }: PlayerPageProps) {
  const { data: channels, isLoading } = useChannels()
  const { currentChannel, setCurrentChannel } = usePlayerStore()

  useEffect(() => {
    if (channelId && channels) {
      const channel = channels.find((c) => c.id === channelId)
      if (channel) {
        setCurrentChannel(channel)
      }
    }
  }, [channelId, channels, setCurrentChannel])

  if (isLoading) return <LoadingSpinner size="lg" className="mt-12" />

  if (!currentChannel) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
        <p>Select a channel to start watching</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="max-w-4xl w-full mx-auto space-y-4">
        <Player />

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-4">
          <div className="flex items-center gap-3">
            {currentChannel.logo && (
              <img src={currentChannel.logo} alt="" className="w-10 h-10 object-contain rounded-lg" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {currentChannel.name}
              </h2>
              <div className="flex gap-2 mt-1">
                <Badge variant="category">{currentChannel.category}</Badge>
                <Badge>{currentChannel.country}</Badge>
                <Badge>{currentChannel.language}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
