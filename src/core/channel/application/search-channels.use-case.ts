import type { Channel } from '../domain/channel.ts'
import type { ChannelRepository } from '../domain/channel.repository.ts'

interface SearchIndex {
  channelsById: Map<string, Channel>
  channelsByCountry: Map<string, Channel[]>
  channelsByCategory: Map<string, Channel[]>
  channelsByLanguage: Map<string, Channel[]>
}

export class SearchChannelsUseCase {
  private index: SearchIndex | null = null

  private readonly channelRepository: ChannelRepository

  constructor(channelRepository: ChannelRepository) {
    this.channelRepository = channelRepository
  }

  private async buildIndex(): Promise<SearchIndex> {
    const channels = await this.channelRepository.getAll()

    const channelsById = new Map<string, Channel>()
    const channelsByCountry = new Map<string, Channel[]>()
    const channelsByCategory = new Map<string, Channel[]>()
    const channelsByLanguage = new Map<string, Channel[]>()

    for (const channel of channels) {
      channelsById.set(channel.id, channel)

      const country = channel.country.toLowerCase()
      if (!channelsByCountry.has(country)) channelsByCountry.set(country, [])
      channelsByCountry.get(country)!.push(channel)

      const category = channel.category.toLowerCase()
      if (!channelsByCategory.has(category)) channelsByCategory.set(category, [])
      channelsByCategory.get(category)!.push(channel)

      const language = channel.language.toLowerCase()
      if (!channelsByLanguage.has(language)) channelsByLanguage.set(language, [])
      channelsByLanguage.get(language)!.push(channel)
    }

    return { channelsById, channelsByCountry, channelsByCategory, channelsByLanguage }
  }

  private async getIndex(): Promise<SearchIndex> {
    if (!this.index) {
      this.index = await this.buildIndex()
    }
    return this.index
  }

  invalidateIndex() {
    this.index = null
  }

  async search(query: string): Promise<Channel[]> {
    const { channelsById } = await this.getIndex()
    const lower = query.toLowerCase()

    const results: Channel[] = []
    for (const channel of channelsById.values()) {
      if (channel.name.toLowerCase().includes(lower)) {
        results.push(channel)
      }
    }

    return results
  }

  async getById(id: string): Promise<Channel | undefined> {
    const { channelsById } = await this.getIndex()
    return channelsById.get(id)
  }

  async getAllCountries(): Promise<string[]> {
    const { channelsByCountry } = await this.getIndex()
    return [...channelsByCountry.keys()].sort()
  }

  async getAllCategories(): Promise<string[]> {
    const { channelsByCategory } = await this.getIndex()
    return [...channelsByCategory.keys()].sort()
  }

  async getAllLanguages(): Promise<string[]> {
    const { channelsByLanguage } = await this.getIndex()
    return [...channelsByLanguage.keys()].sort()
  }
}
