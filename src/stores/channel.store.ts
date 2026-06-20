import { create } from 'zustand'
import type { Channel } from '../core/channel/domain/channel.ts'
import type { ChannelFilters } from '../core/channel/application/filter-channels.use-case.ts'

export interface ChannelStoreState {
  channels: Channel[]
  filteredChannels: Channel[]
  searchQuery: string
  filters: ChannelFilters
  isLoading: boolean
  error: string | null
  setChannels: (channels: Channel[]) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: ChannelFilters) => void
  clearFilters: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useChannelStore = create<ChannelStoreState>((set) => ({
  channels: [],
  filteredChannels: [],
  searchQuery: '',
  filters: {},
  isLoading: false,
  error: null,

  setChannels: (channels) =>
    set({ channels, filteredChannels: channels, error: null }),

  setSearchQuery: (searchQuery) =>
    set((state) => {
      const lower = searchQuery.toLowerCase()
      const filtered = state.channels.filter((ch) =>
        ch.name.toLowerCase().includes(lower),
      )
      return { searchQuery, filteredChannels: filtered }
    }),

  setFilters: (filters) =>
    set((state) => {
      let filtered = state.channels

      if (filters.country) {
        filtered = filtered.filter(
          (ch) => ch.country.toLowerCase() === filters.country!.toLowerCase(),
        )
      }
      if (filters.category) {
        filtered = filtered.filter(
          (ch) => ch.category.toLowerCase() === filters.category!.toLowerCase(),
        )
      }
      if (filters.language) {
        filtered = filtered.filter(
          (ch) => ch.language.toLowerCase() === filters.language!.toLowerCase(),
        )
      }
      if (filters.favoritesOnly && filters.favoriteIds) {
        filtered = filtered.filter((ch) => filters.favoriteIds!.includes(ch.id))
      }

      return { filters, filteredChannels: filtered }
    }),

  clearFilters: () =>
    set({ filters: {}, filteredChannels: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))
