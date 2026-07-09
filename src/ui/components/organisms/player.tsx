import { useCallback, useEffect, useState, useRef } from 'react'
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
    volume,
    muted,
    isZoomed,
    loadChannel,
    setVolume,
    toggleMute,
    toggleFullscreen,
    toggleZoom,
  } = usePlayer()

  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<number | undefined>(undefined)
  const controlsTimeout = useRef<number | undefined>(undefined)

  const isLoading = playbackState === 'loading' || playbackState === 'buffering'

  useEffect(() => {
    if (channel) {
      loadChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  const handleMouseEnter = useCallback(() => {
    clearTimeout(controlsTimeout.current)
    setShowControls(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    controlsTimeout.current = setTimeout(() => setShowControls(false), 1500)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current)
      clearTimeout(controlsTimeout.current)
    }
  }, [])

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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className={`w-full h-full transition-all duration-300 ${isZoomed ? 'object-cover' : 'object-contain'}`}
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
            className="px-4 py-2 rounded-lg bg-[var(--color-accent-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls && channel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <PlayerControls
          volume={volume}
          muted={muted}
          isZoomed={isZoomed}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onToggleZoom={toggleZoom}
        />
      </div>
    </div>
  )
}
