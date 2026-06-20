import { useQuery } from '@tanstack/react-query'
import { ChannelLocalStorageRepository } from '../../core/channel/infrastructure/channel.local-storage.repository.ts'
import { ParseM3uUseCase } from '../../core/channel/application/parse-m3u.use-case.ts'
import { SearchChannelsUseCase } from '../../core/channel/application/search-channels.use-case.ts'
import { FilterChannelsUseCase } from '../../core/channel/application/filter-channels.use-case.ts'
import type { ChannelFilters } from '../../core/channel/application/filter-channels.use-case.ts'
import type { ChannelOrigin } from '../../core/channel/domain/channel.ts'

const channelRepo = new ChannelLocalStorageRepository()
const searchUseCase = new SearchChannelsUseCase(channelRepo)
const filterUseCase = new FilterChannelsUseCase(channelRepo)
const parseUseCase = new ParseM3uUseCase(channelRepo)

export function useChannels() {
  return useQuery({
    queryKey: ['channels'],
    queryFn: () => channelRepo.getAll(),
  })
}

export function useSearchChannels(query: string) {
  return useQuery({
    queryKey: ['channels', 'search', query],
    queryFn: () => searchUseCase.search(query),
    enabled: query.length > 0,
  })
}

export function useFilteredChannels(filters: ChannelFilters) {
  return useQuery({
    queryKey: ['channels', 'filtered', filters],
    queryFn: () => filterUseCase.execute(filters),
  })
}

export function useChannelCounts() {
  return useQuery({
    queryKey: ['channels', 'counts'],
    queryFn: async () => {
      const channels = await channelRepo.getAll()
      const countries = [...new Set(channels.map((c) => c.country))].sort()
      const categories = [...new Set(channels.map((c) => c.category))].sort()
      const languages = [...new Set(channels.map((c) => c.language))].sort()
      return { total: channels.length, countries, categories, languages }
    },
  })
}

export async function importM3U(content: string, origin?: ChannelOrigin) {
  const count = await parseUseCase.execute(content, origin)
  searchUseCase.invalidateIndex()
  return count
}
