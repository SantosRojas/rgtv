import { Icon } from '../atoms/icon.tsx'

interface PlayerControlsProps {
  volume: number
  muted: boolean
  isZoomed: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onToggleZoom: () => void
}

export function PlayerControls({
  volume,
  muted,
  isZoomed,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onToggleZoom,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur-sm">
      <button
        onClick={onToggleMute}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
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

      <div className="flex-1" />

      <button
        onClick={onToggleZoom}
        className={`p-2 rounded-lg transition-colors text-white ${
          isZoomed ? 'bg-[var(--color-accent-primary)]/30' : 'hover:bg-white/10'
        }`}
        aria-label={isZoomed ? 'Encajar' : 'Zoom'}
        title={isZoomed ? 'Encajar' : 'Zoom'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isZoomed ? (
            <>
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </>
          ) : (
            <>
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </>
          )}
        </svg>
      </button>

      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
        aria-label="Pantalla completa"
      >
        <Icon name="fullscreen-icon" size={20} />
      </button>
    </div>
  )
}
