import { useCallback, useEffect } from 'react'
import { usePlayer } from '../../hooks/use-player.ts'
import { PlayerControls } from '../molecules/player-controls.tsx'
import { LoadingSpinner } from '../atoms/loading-spinner.tsx'
import type { Channel } from '../../../core/channel/domain/channel.ts'

interface PlayerProps {
  channel?: Channel | null
}

export function Player({ channel }: PlayerProps) {
  const {
    videoRef,
    containerRef,
    playbackState,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    loadChannel,
  } = usePlayer()

  const isPlaying = playbackState === 'playing'
  const isLoading = playbackState === 'loading' || playbackState === 'buffering'

  useEffect(() => {
    if (channel) {
      loadChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id])

  const handleRetry = useCallback(() => {
    if (channel) {
      loadChannel(channel)
    }
  }, [channel, loadChannel])

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden"
      style={{ aspectRatio: '16/9' }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        aria-label="Reproductor de video"
      />

      {!channel && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <p className="text-[var(--color-text-secondary)] text-lg">Selecciona un canal para reproducir</p>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {playbackState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
          <p className="text-red-400 text-lg">Error al cargar el stream</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg bg-(--color-accent-primary) text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0">
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          muted={muted}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  )
}
