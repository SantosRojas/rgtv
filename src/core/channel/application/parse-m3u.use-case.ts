import type { ChannelRepository } from '../domain/channel.repository.ts'
import type { ChannelOrigin } from '../domain/channel.ts'
import { parseM3U } from '../infrastructure/m3u.parser.ts'

export class ParseM3uUseCase {
  private readonly channelRepository: ChannelRepository

  constructor(channelRepository: ChannelRepository) {
    this.channelRepository = channelRepository
  }

  async execute(content: string, origin?: ChannelOrigin): Promise<number> {
    const channels = parseM3U(content, origin)
    await this.channelRepository.saveAll(channels)
    return channels.length
  }
}
