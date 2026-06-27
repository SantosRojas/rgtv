import type { Channel } from '../domain/channel.ts'
import type { ChannelRepository } from '../domain/channel.repository.ts'

export interface ChannelFilters {
  category?: string | undefined
  favoritesOnly?: boolean | undefined
  favoriteIds?: string[] | undefined
}

export class FilterChannelsUseCase {
  private readonly channelRepository: ChannelRepository

  constructor(channelRepository: ChannelRepository) {
    this.channelRepository = channelRepository
  }

  async execute(filters: ChannelFilters): Promise<Channel[]> {
    const channels = await this.channelRepository.getAll()

    return channels.filter((channel) => {
      if (filters.category && channel.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false
      }
      if (filters.favoritesOnly && filters.favoriteIds) {
        if (!filters.favoriteIds.includes(channel.id)) {
          return false
        }
      }
      return true
    })
  }
}
