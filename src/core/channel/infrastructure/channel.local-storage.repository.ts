import type { ChannelRepository } from '../domain/channel.repository.ts'
import type { Channel } from '../domain/channel.ts'
import { StorageError } from '../../shared/domain/errors.ts'

const STORAGE_KEY = 'rgtv_channels'

export class ChannelLocalStorageRepository implements ChannelRepository {
  async getAll(): Promise<Channel[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as Channel[]
    } catch {
      throw new StorageError('Failed to read channels from storage')
    }
  }

  async saveAll(channels: Channel[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(channels))
    } catch {
      throw new StorageError('Failed to save channels to storage')
    }
  }
}
