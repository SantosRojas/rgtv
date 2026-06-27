import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useChannels, importM3U } from './use-channels.ts'
import { usePlaylistStore } from '../../stores/playlist.store.ts'

const IPTV_ORG_URL = 'https://iptv-org.github.io/iptv/index.m3u'

export function useInitChannels() {
  const { data: channels } = useChannels()
  const playlists = usePlaylistStore((s) => s.playlists)
  const addPlaylist = usePlaylistStore((s) => s.addPlaylist)
  const queryClient = useQueryClient()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    if (channels === undefined) return

    if (channels.length > 0 || playlists.length > 0) {
      initialized.current = true
      return
    }

    initialized.current = true

    fetch(IPTV_ORG_URL)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.text()
      })
      .then((content) => importM3U(content, 'default_iptv_org'))
      .then(() => {
        addPlaylist('IPTV-org', IPTV_ORG_URL)
        queryClient.invalidateQueries({ queryKey: ['channels'] })
      })
      .catch(() => {})
  }, [channels, playlists, addPlaylist, queryClient])
}
