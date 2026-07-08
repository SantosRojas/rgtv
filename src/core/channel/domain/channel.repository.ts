import type { Channel } from './channel.ts'

export interface ChannelRepository {
  getAll(): Promise<Channel[]>
  saveAll(channels: Channel[]): Promise<void>
  clear(): Promise<void>
}
