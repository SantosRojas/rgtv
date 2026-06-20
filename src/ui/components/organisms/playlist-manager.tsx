import { useState, useRef } from 'react'
import { usePlaylistStore } from '../../../stores/playlist.store.ts'
import { Button } from '../atoms/button.tsx'
import { Input } from '../atoms/input.tsx'
import { Icon } from '../atoms/icon.tsx'
import { importM3U } from '../../hooks/use-channels.ts'
import type { ChannelOrigin } from '../../../core/channel/domain/channel.ts'

const DEFAULT_PLAYLISTS = [
  { name: 'IPTV-org', url: 'https://iptv-org.github.io/iptv/index.m3u' },
  { name: 'TDTChannels', url: 'https://www.tdtchannels.com/lists/tv.m3u8' },
]

export function PlaylistManager() {
  const { playlists, addPlaylist, removePlaylist, setActivePlaylist, activePlaylistId } = usePlaylistStore()
  const [url, setUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportUrl = async () => {
    if (!url.trim()) return
    setImporting(true)
    setError(null)

    try {
      const response = await fetch(url)
      const content = await response.text()
      await importM3U(content)
      addPlaylist(url.split('/').pop() ?? 'Remote Playlist', url)
      setUrl('')
    } catch {
      setError('Failed to import playlist')
    } finally {
      setImporting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setError(null)

    try {
      const content = await file.text()
      await importM3U(content)
      addPlaylist(file.name.replace('.m3u', '').replace('.m3u8', ''), undefined, content)
    } catch {
      setError('Failed to parse file')
    } finally {
      setImporting(false)
    }
  }

  const handleDefaultImport = async (name: string, m3uUrl: string) => {
    setImporting(true)
    setError(null)
    try {
      const response = await fetch(m3uUrl)
      const content = await response.text()
      const origin = name === 'IPTV-org' ? 'default_iptv_org' as ChannelOrigin : 'default_tdtchannels' as ChannelOrigin
      await importM3U(content, origin)
      addPlaylist(name, m3uUrl)
    } catch {
      setError(`Failed to import ${name}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Default Playlists</h2>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_PLAYLISTS.map((pl) => (
            <Button
              key={pl.name}
              variant="secondary"
              size="sm"
              onClick={() => handleDefaultImport(pl.name, pl.url)}
              disabled={importing}
            >
              {pl.name}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Import from URL</h2>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/playlist.m3u"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleImportUrl} disabled={importing || !url.trim()}>
            Import
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Upload File</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept=".m3u,.m3u8,audio/x-mpegurl"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload M3U file"
        />
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
          Choose .m3u file
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {playlists.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">My Playlists</h2>
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
                  aria-label={`Remove ${pl.name}`}
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
