import { lazy, Suspense, useCallback, useEffect, useRef } from 'react'
import { useChannelStore } from '../../stores/channel.store.ts'
import { usePlayerStore } from '../../stores/player.store.ts'
import { useFavoriteStore } from '../../stores/favorite.store.ts'
import { useChannels } from '../hooks/use-channels.ts'
import { SearchBar } from '../components/molecules/search-bar.tsx'
import { FilterBar } from '../components/molecules/filter-bar.tsx'
import { ChannelList } from '../components/organisms/channel-list.tsx'
import { GlassPanel } from '../components/atoms/glass-panel.tsx'
import { Badge } from '../components/atoms/badge.tsx'
import { Icon } from '../components/atoms/icon.tsx'
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
    <div className="h-full flex lg:flex-row flex-col gap-4 p-4">
      <div className="lg:w-3/4 w-full lg:h-full flex flex-col gap-4">
        <Suspense fallback={<div className="aspect-video bg-black/40 rounded-xl" />}>
          <GlassPanel padding="none">
            <Player channel={currentChannel} />
          </GlassPanel>
        </Suspense>

        {currentChannel && (
          <GlassPanel>
            <div className="flex items-center gap-3">
              {currentChannel.logo && (
                <img src={currentChannel.logo} alt="" className="w-10 h-10 object-contain rounded-lg" />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">
                  {currentChannel.name}
                </h2>
                <div className="flex gap-2 mt-1">
                  <Badge variant="category">{currentChannel.category}</Badge>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(currentChannel.id)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label={favoriteIds.includes(currentChannel.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Icon
                  name={favoriteIds.includes(currentChannel.id) ? 'heart-filled-icon' : 'heart-icon'}
                  size={22}
                  className={favoriteIds.includes(currentChannel.id) ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-secondary)]'}
                />
              </button>
            </div>
          </GlassPanel>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-4">
        <GlassPanel className="relative z-[1] isolate">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              RGTV
              <span className="text-sm font-normal text-[var(--color-text-secondary)] ml-2">
                {filteredChannels.length} / {channels.length} canales
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
        </GlassPanel>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ChannelList
            channels={filteredChannels}
            currentChannelId={currentChannel?.id ?? null}
            isLoading={isLoading}
            onSelectChannel={handleSelectChannel}
          />
        </div>
      </div>
    </div>
  )
}
