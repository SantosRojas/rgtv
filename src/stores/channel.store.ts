import { create } from 'zustand'
export interface ChannelFilters {
  category?: string | undefined
  favoritesOnly?: boolean | undefined
  favoriteIds?: string[] | undefined
}

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
