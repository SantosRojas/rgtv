import { PlaylistManager } from '../components/organisms/playlist-manager.tsx'
import { GlassPanel } from '../components/atoms/glass-panel.tsx'
import { Input } from '../components/atoms/input.tsx'
import { Button } from '../components/atoms/button.tsx'
import type { ThemeMode, AccentVariant } from '../../stores/settings.store.ts'
import { useSettingsStore } from '../../stores/settings.store.ts'
import { usePlaylistStore } from '../../stores/playlist.store.ts'

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'dark', label: 'Oscuro' },
  { value: 'light', label: 'Claro' },
  { value: 'system', label: 'Sistema' },
]

const accentOptions: { value: AccentVariant; label: string; color: string }[] = [
  { value: 'purple', label: 'Púrpura', color: '#c084fc' },
  { value: 'emerald', label: 'Esmeralda', color: '#34d399' },
  { value: 'violet', label: 'Violeta', color: '#a78bfa' },
  { value: 'cyan', label: 'Cian', color: '#22d3ee' },
  { value: 'amber', label: 'Ámbar', color: '#fbbf24' },
  { value: 'rose', label: 'Rosa', color: '#fb7185' },
  { value: 'blue', label: 'Azul', color: '#60a5fa' },
  { value: 'sky', label: 'Celeste', color: '#38bdf8' },
]

export default function SettingsPage() {
  const { mode, accent, customAccent, proxyUrl, setMode, setAccent, setCustomAccent, setProxyUrl } = useSettingsStore()
  const { playlists } = usePlaylistStore()

  return (
    <div className="h-full overflow-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Ajustes</h1>

        <GlassPanel title="Listas de reproducción">
          <PlaylistManager />
        </GlassPanel>

        <GlassPanel title="Tema">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">Modo</p>
              <div className="flex gap-2 flex-wrap">
                {modes.map((m) => (
                  <Button
                    key={m.value}
                    variant={mode === m.value ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setMode(m.value)}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">Color de acento</p>
              <div className="flex gap-2 flex-wrap">
                {accentOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAccent(a.value)}
                    className={`w-8 h-8 rounded-full transition-all border-2 ${
                      accent === a.value
                        ? 'border-[var(--color-text-primary)] scale-110 shadow-[0_0_8px_var(--color-accent-primary)]'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: a.color }}
                    aria-label={a.label}
                    title={a.label}
                  />
                ))}
                <div className="relative">
                  <input
                    type="color"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:scale-105 transition-all"
                    style={{ backgroundColor: customAccent }}
                    aria-label="Color personalizado"
                    title="Color personalizado"
                  />
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="Proxy CORS">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            Configura una URL de proxy para streams que requieran bypass de CORS.
          </p>
          <Input
            type="url"
            placeholder="https://mi-proxy.com/"
            value={proxyUrl}
            onChange={(e) => setProxyUrl(e.target.value)}
          />
        </GlassPanel>

        <GlassPanel title="Datos">
          <div className="space-y-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Exporta tus listas o limpia la caché de canales.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" size="sm" onClick={() => {
                const data = JSON.stringify(playlists, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'rgtv-playlists.json'
                a.click()
                URL.revokeObjectURL(url)
              }}>
                Exportar listas
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
