import { Icon } from '../atoms/icon.tsx'

interface PlayerControlsProps {
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerControls({
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  muted,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 backdrop-blur-md">
      <button
        onClick={onTogglePlay}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
        disabled={isLoading}
        aria-label={isPlaying ? 'Pausa' : 'Reproducir'}
      >
        <Icon name={isPlaying ? 'pause-icon' : 'play-icon'} size={22} />
      </button>

      <span className="text-xs text-white/70 tabular-nums w-12 text-right">
        {formatTime(currentTime)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="flex-1 h-1 accent-[var(--color-accent-primary)] cursor-pointer"
        aria-label="Buscar"
      />

      <span className="text-xs text-white/70 tabular-nums w-12">
        {formatTime(duration)}
      </span>

      <button
        onClick={onToggleMute}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        <Icon name={muted ? 'mute-icon' : volume > 0.5 ? 'volume-high-icon' : 'volume-low-icon'} size={20} />
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-20 h-1 accent-[var(--color-accent-primary)] cursor-pointer"
        aria-label="Volumen"
      />

      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white"
        aria-label="Pantalla completa"
      >
        <Icon name="fullscreen-icon" size={20} />
      </button>
    </div>
  )
}
