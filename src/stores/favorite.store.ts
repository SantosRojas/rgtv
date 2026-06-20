import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoriteStoreState {
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  setFavorites: (ids: string[]) => void
}

export const useFavoriteStore = create<FavoriteStoreState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id) =>
        set((state) => {
          const exists = state.favoriteIds.includes(id)
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter((fid) => fid !== id)
              : [...state.favoriteIds, id],
          }
        }),

      isFavorite: (id) => get().favoriteIds.includes(id),

      setFavorites: (favoriteIds) => set({ favoriteIds }),
    }),
    {
      name: 'rgtv_favorites',
    },
  ),
)
