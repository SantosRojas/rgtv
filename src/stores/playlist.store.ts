import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Playlist } from '../core/playlist/domain/playlist.ts'
import { generateId } from '../core/shared/utils/id-generator.ts'

export interface PlaylistStoreState {
  playlists: Playlist[]
  activePlaylistId: string | null
  addPlaylist: (name: string, url?: string, rawContent?: string) => void
  removePlaylist: (id: string) => void
  setActivePlaylist: (id: string | null) => void
}

export const usePlaylistStore = create<PlaylistStoreState>()(
  persist(
    (set) => ({
      playlists: [],
      activePlaylistId: null,

      addPlaylist: (name, url, rawContent) =>
        set((state) => {
          const now = new Date().toISOString()
          const playlist: Playlist = {
            id: generateId(),
            name,
            ...(url !== undefined ? { url } : {}),
            ...(rawContent !== undefined ? { rawContent } : {}),
            createdAt: now,
            updatedAt: now,
            isActive: state.playlists.length === 0,
          }
          return { playlists: [...state.playlists, playlist] }
        }),

      removePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
          activePlaylistId:
            state.activePlaylistId === id ? null : state.activePlaylistId,
        })),

      setActivePlaylist: (activePlaylistId) =>
        set((state) => ({
          activePlaylistId,
          playlists: state.playlists.map((p) => ({
            ...p,
            isActive: p.id === activePlaylistId,
          })),
        })),
    }),
    {
      name: 'rgtv_playlists',
    },
  ),
)
