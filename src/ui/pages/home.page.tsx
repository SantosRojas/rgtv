import { lazy, Suspense, useCallback, useEffect, useRef } from 'react'
import { useChannelStore } from '../../stores/channel.store.ts'
import { usePlayerStore } from '../../stores/player.store.ts'
import { useFavoriteStore } from '../../stores/favorite.store.ts'
import { useChannels } from '../hooks/use-channels.ts'
import { SearchBar } from '../components/molecules/search-bar.tsx'
import { FilterBar } from '../components/molecules/filter-bar.tsx'
import { ChannelList } from '../components/organisms/channel-list.tsx'
import { Badge } from '../components/atoms/badge.tsx'
import type { Channel } from '../../core/channel/domain/channel.ts'

const LAST_CHANNEL_KEY = 'rgtv_last_channel'

const Player = lazy(() => import('../components/organisms/player.tsx').then((m) => ({ default: m.Player })))

export default function HomePage() {
  const { data: channels = [], isLoading } = useChannels()
  const { searchQuery, filters, setSearchQuery, setFilters, clearFilters } = useChannelStore()
  const { favoriteIds, toggleFavorite } = useFavoriteStore()
  const { currentChannel, setCurrentChannel } = usePlayerStore()
  const restored = useRef(false)

  useEffect(() => {
    if (restored.current || isLoading || channels.length === 0) return
    restored.current = true
    const lastId = localStorage.getItem(LAST_CHANNEL_KEY)
    if (lastId) {
      const lastChannel = channels.find((c) => c.id === lastId)
      if (lastChannel) {
        setCurrentChannel(lastChannel)
      }
    }
  }, [channels, isLoading, setCurrentChannel])

  const handleSelectChannel = useCallback((channel: Channel) => {
    localStorage.setItem(LAST_CHANNEL_KEY, channel.id)
    setCurrentChannel(channel)
  }, [setCurrentChannel])

  const filteredChannels = channels.filter((ch) => {
    const matchesSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filters.category || ch.category === filters.category
    const matchesFavorites = !filters.favoritesOnly || favoriteIds.includes(ch.id)
    return matchesSearch && matchesCategory && matchesFavorites
  })

  return (
    <div className="h-full flex lg:flex-row flex-col">
      <div className="lg:w-3/4 w-full lg:h-full lg:overflow-y-auto p-4 space-y-4 flex flex-col">
        <Suspense fallback={<div className="aspect-video bg-black/40 rounded-xl" />}>
          <Player channel={currentChannel} />
        </Suspense>
        {currentChannel && (
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-4 shrink-0">
            <div className="flex items-center gap-3">
              {currentChannel.logo && (
                <img src={currentChannel.logo} alt="" className="w-10 h-10 object-contain rounded-lg" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-(--color-text-primary)">
                  {currentChannel.name}
                </h2>
                <div className="flex gap-2 mt-1">
                  <Badge variant="category">{currentChannel.category}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 space-y-3 shrink-0">
          <h1 className="text-2xl font-bold text-(--color-text-primary)">
            RGTV
            <span className="text-sm font-normal text-(--color-text-secondary) ml-2">
              {channels.length} canales
            </span>
          </h1>
          <SearchBar onSearch={setSearchQuery} />
          <FilterBar
            categories={[...new Set(channels.map((c) => c.category))].sort()}
            selectedCategory={filters.category}
            favoritesOnly={filters.favoritesOnly ?? false}
            onCategoryChange={(category) => setFilters({ ...filters, category })}
            onFavoritesToggle={() => setFilters({ ...filters, favoritesOnly: !filters.favoritesOnly, favoriteIds })}
            onClear={clearFilters}
          />
        </div>
        <div className="flex-1 px-4 pb-4 overflow-hidden">
          <ChannelList
            channels={filteredChannels}
            favoriteIds={favoriteIds}
            isLoading={isLoading}
            onToggleFavorite={toggleFavorite}
            onSelectChannel={handleSelectChannel}
          />
        </div>
      </div>
    </div>
  )
}
