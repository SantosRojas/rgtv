import type { Playlist } from '../domain/playlist.ts'
import { StorageError } from '../../shared/domain/errors.ts'

const STORAGE_KEY = 'rgtv_playlists'

export class PlaylistLocalStorageRepository {
  async getAll(): Promise<Playlist[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as Playlist[]
    } catch {
      throw new StorageError('Failed to read playlists from storage')
    }
  }

  async save(playlist: Playlist): Promise<void> {
    try {
      const playlists = await this.getAll()
      const index = playlists.findIndex((p) => p.id === playlist.id)
      if (index >= 0) {
        playlists[index] = playlist
      } else {
        playlists.push(playlist)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
    } catch {
      throw new StorageError('Failed to save playlist')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const playlists = await this.getAll()
      const filtered = playlists.filter((p) => p.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch {
      throw new StorageError('Failed to delete playlist')
    }
  }
}
