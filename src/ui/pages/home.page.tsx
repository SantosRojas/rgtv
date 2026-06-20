import { useCallback } from 'react'
import { useChannelStore } from '../../stores/channel.store.ts'
import { useFavoriteStore } from '../../stores/favorite.store.ts'
import { useChannels, useChannelCounts } from '../hooks/use-channels.ts'
import { SearchBar } from '../components/molecules/search-bar.tsx'
import { FilterBar } from '../components/molecules/filter-bar.tsx'
import { ChannelList } from '../components/organisms/channel-list.tsx'
import type { Channel } from '../../core/channel/domain/channel.ts'

export default function HomePage() {
  const { data: channels = [], isLoading } = useChannels()
  const { data: counts } = useChannelCounts()
  const { searchQuery, filters, setSearchQuery, setFilters, clearFilters } = useChannelStore()
  const { favoriteIds, toggleFavorite } = useFavoriteStore()

  const handleSelectChannel = useCallback((channel: Channel) => {
    window.location.hash = `#/reproductor/${encodeURIComponent(channel.id)}`
  }, [])

  const filteredChannels = channels.filter((ch) => {
    const matchesSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCountry = !filters.country || ch.country === filters.country
    const matchesCategory = !filters.category || ch.category === filters.category
    const matchesLanguage = !filters.language || ch.language === filters.language
    const matchesFavorites = !filters.favoritesOnly || favoriteIds.includes(ch.id)
    return matchesSearch && matchesCountry && matchesCategory && matchesLanguage && matchesFavorites
  })

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-3 flex-shrink-0">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          RGTV
          <span className="text-sm font-normal text-[var(--color-text-secondary)] ml-2">
            {channels.length} channels
          </span>
        </h1>
        <SearchBar onSearch={setSearchQuery} />
        <FilterBar
          countries={counts?.countries ?? []}
          categories={counts?.categories ?? []}
          languages={counts?.languages ?? []}
          selectedCountry={filters.country}
          selectedCategory={filters.category}
          selectedLanguage={filters.language}
          favoritesOnly={filters.favoritesOnly ?? false}
          onCountryChange={(country) => setFilters({ ...filters, country })}
          onCategoryChange={(category) => setFilters({ ...filters, category })}
          onLanguageChange={(language) => setFilters({ ...filters, language })}
          onFavoritesToggle={() => setFilters({ ...filters, favoritesOnly: !filters.favoritesOnly, favoriteIds })}
          onClear={clearFilters}
        />
      </div>
      <div className="flex-1 px-4 pb-4">
        <ChannelList
          channels={filteredChannels}
          favoriteIds={favoriteIds}
          isLoading={isLoading}
          onToggleFavorite={toggleFavorite}
          onSelectChannel={handleSelectChannel}
        />
      </div>
    </div>
  )
}
