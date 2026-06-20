import type { FavoriteRepository } from '../domain/favorite.repository.ts'
import { StorageError } from '../../shared/domain/errors.ts'

const STORAGE_KEY = 'rgtv_favorites'

export class FavoriteLocalStorageRepository implements FavoriteRepository {
  async getFavorites(): Promise<string[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as string[]
    } catch {
      throw new StorageError('Failed to read favorites from storage')
    }
  }

  async saveFavorites(ids: string[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      throw new StorageError('Failed to save favorites')
    }
  }
}
