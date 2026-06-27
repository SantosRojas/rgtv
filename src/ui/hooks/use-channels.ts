import { useQuery } from '@tanstack/react-query'
import { ChannelLocalStorageRepository } from '../../core/channel/infrastructure/channel.local-storage.repository.ts'
import { ParseM3uUseCase } from '../../core/channel/application/parse-m3u.use-case.ts'
import type { ChannelOrigin } from '../../core/channel/domain/channel.ts'

const channelRepo = new ChannelLocalStorageRepository()
const parseUseCase = new ParseM3uUseCase(channelRepo)

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: () => channelRepo.getAll(),
  })
}

export async function importM3U(content: string, origin?: ChannelOrigin) {
  const count = await parseUseCase.execute(content, origin)
  return count
}
