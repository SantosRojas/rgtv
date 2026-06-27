import { useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePlaylistStore } from '../../../stores/playlist.store.ts'
import { Button } from '../atoms/button.tsx'
import { Icon } from '../atoms/icon.tsx'
import { importM3U } from '../../hooks/use-channels.ts'

const IPTV_ORG_URL = 'https://iptv-org.github.io/iptv/index.m3u'

export function PlaylistManager() {
  const queryClient = useQueryClient()
  const { playlists, addPlaylist, removePlaylist, setActivePlaylist, activePlaylistId } = usePlaylistStore()
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const invalidateChannels = () => queryClient.invalidateQueries({ queryKey: ['channels'] })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setError(null)

    try {
      const content = await file.text()
      await importM3U(content)
      addPlaylist(file.name.replace('.m3u', '').replace('.m3u8', ''), undefined, content)
      await invalidateChannels()
    } catch {
      setError('Error al leer el archivo')
    } finally {
      e.target.value = ''
      setImporting(false)
    }
  }

  const handleIptvImport = async () => {
    setImporting(true)
    setError(null)
    try {
      const response = await fetch(IPTV_ORG_URL)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const content = await response.text()
      await importM3U(content, 'default_iptv_org')
      addPlaylist('IPTV-org', IPTV_ORG_URL)
      await invalidateChannels()
    } catch {
      setError('Error al importar IPTV-org')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Listas predeterminadas</h2>
        <Button variant="secondary" size="sm" onClick={handleIptvImport} disabled={importing}>
          IPTV-org
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Subir archivo</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept=".m3u,.m3u8,audio/x-mpegurl"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Subir archivo M3U"
        />
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
          Elegir archivo .m3u
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {playlists.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Mis listas</h2>
          <div className="space-y-2">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  activePlaylistId === pl.id
                    ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
                    : 'border-white/10 bg-slate-900/40 backdrop-blur-md'
                }`}
                onClick={() => setActivePlaylist(pl.id)}
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{pl.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{new Date(pl.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removePlaylist(pl.id)
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-red-400"
                  aria-label={`Quitar ${pl.name}`}
                >
                  <Icon name="trash-icon" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
