import type { ChannelRepository } from '../domain/channel.repository.ts'
import type { Channel } from '../domain/channel.ts'
import { StorageError } from '../../shared/domain/errors.ts'

const STORAGE_KEY = 'rgtv_channels'

export class ChannelLocalStorageRepository implements ChannelRepository {
  async getAll(): Promise<Channel[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const channels: Channel[] = JSON.parse(raw)
      for (const ch of channels) {
        ch.category = ch.category.split(';')[0]!.trim()
      }
      return channels
    } catch {
      throw new StorageError('Failed to read channels from storage')
    }
  }

  async saveAll(channels: Channel[]): Promise<void> {
    try {
      const normalized = channels.map((ch) => ({
        ...ch,
        category: ch.category.split(';')[0]!.trim(),
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    } catch {
      throw new StorageError('Failed to save channels to storage')
    }
  }
}
