import { useFavoriteStore } from '../../stores/favorite.store.ts'

export function useFavorites() {
  const favoriteIds = useFavoriteStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)
  const isFavorite = useFavoriteStore((s) => s.isFavorite)

  return { favoriteIds, toggleFavorite, isFavorite }
}
