import { usePlayer } from '../../hooks/use-player.ts'
import { PlayerControls } from '../molecules/player-controls.tsx'
import { LoadingSpinner } from '../atoms/loading-spinner.tsx'

export function Player() {
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
  } = usePlayer()

  const isPlaying = playbackState === 'playing'
  const isLoading = playbackState === 'loading' || playbackState === 'buffering'

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
        aria-label="Video player"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {playbackState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <p className="text-red-400 text-lg">Error loading stream</p>
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
