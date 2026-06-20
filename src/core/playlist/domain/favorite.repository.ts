export interface FavoriteRepository {
  getFavorites(): Promise<string[]>
  saveFavorites(ids: string[]): Promise<void>
}
