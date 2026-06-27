import type { ThemeVariant } from '../../stores/settings.store.ts'
import { useSettingsStore } from '../../stores/settings.store.ts'
import { usePlaylistStore } from '../../stores/playlist.store.ts'
import { Input } from '../components/atoms/input.tsx'
import { Button } from '../components/atoms/button.tsx'

const themes: { value: ThemeVariant; label: string }[] = [
  { value: 'dark-slate', label: 'Pizarra oscura' },
  { value: 'dark-emerald', label: 'Esmeralda oscura' },
  { value: 'dark-violet', label: 'Violeta oscuro' },
  { value: 'dark-cyan', label: 'Cian oscuro' },
]

export default function SettingsPage() {
  const { theme, proxyUrl, setTheme, setProxyUrl } = useSettingsStore()
  const { playlists } = usePlaylistStore()

  const handleExportPlaylists = () => {
    const data = JSON.stringify(playlists, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rgtv-playlists.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Ajustes</h1>

        <section className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-4 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Tema</h2>
          <div className="flex gap-2 flex-wrap">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme(t.value)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-4 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Proxy CORS</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Configura una URL de proxy para streams que requieran bypass de CORS.
          </p>
          <Input
            type="url"
            placeholder="https://mi-proxy.com/"
            value={proxyUrl}
            onChange={(e) => setProxyUrl(e.target.value)}
          />
        </section>

        <section className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-4 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Datos</h2>
          <Button variant="secondary" size="sm" onClick={handleExportPlaylists}>
            Exportar listas
          </Button>
        </section>
      </div>
    </div>
  )
}
