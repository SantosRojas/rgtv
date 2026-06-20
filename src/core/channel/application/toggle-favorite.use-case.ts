import type { FavoriteRepository } from '../../playlist/domain/favorite.repository.ts'
import type { ChannelRepository } from '../domain/channel.repository.ts'

export class ToggleFavoriteUseCase {
  private readonly favoriteRepository: FavoriteRepository
  private readonly channelRepository: ChannelRepository

  constructor(
    favoriteRepository: FavoriteRepository,
    channelRepository: ChannelRepository,
  ) {
    this.favoriteRepository = favoriteRepository
    this.channelRepository = channelRepository
  }

  async execute(channelId: string): Promise<boolean> {
    const favorites = await this.favoriteRepository.getFavorites()
    const channels = await this.channelRepository.getAll()

    const isFavorite = favorites.includes(channelId)
    let updatedFavorites: string[]

    if (isFavorite) {
      updatedFavorites = favorites.filter((id) => id !== channelId)
    } else {
      updatedFavorites = [...favorites, channelId]
    }

    const updatedChannels = channels.map((ch) =>
      ch.id === channelId ? { ...ch, isFavorite: !isFavorite } : ch,
    )

    await this.favoriteRepository.saveFavorites(updatedFavorites)
    await this.channelRepository.saveAll(updatedChannels)

    return !isFavorite
  }
}
