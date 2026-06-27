import { create } from 'zustand'
import type { ChannelFilters } from '../core/channel/application/filter-channels.use-case.ts'

export interface ChannelStoreState {
  searchQuery: string
  filters: ChannelFilters
  setSearchQuery: (query: string) => void
  setFilters: (filters: ChannelFilters) => void
  clearFilters: () => void
}

export const useChannelStore = create<ChannelStoreState>((set) => ({
  searchQuery: '',
  filters: {},

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set({ filters: {} }),
}))
