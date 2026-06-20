import { useEffect, useRef, useCallback } from 'react'
import { HlsPlayer } from '../../core/player/infrastructure/hls.player.ts'
import { PlayerService } from '../../core/player/application/player.service.ts'
import { usePlayerStore } from '../../stores/player.store.ts'
import type { Channel } from '../../core/channel/domain/channel.ts'

let playerServiceInstance: PlayerService | null = null

function getPlayerService(): PlayerService {
  if (!playerServiceInstance) {
    const hlsPlayer = new HlsPlayer()
    playerServiceInstance = new PlayerService(hlsPlayer)
  }
  return playerServiceInstance
}

export function usePlayer() {
  const service = getPlayerService()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const store = usePlayerStore()

  useEffect(() => {
    if (videoRef.current) {
      service.player.attach(videoRef.current)
    }

    const unsubscribe = service.player.on((event) => {
      if (event.type === 'stateChange') {
        store.setPlaybackState(event.state)
      }
      if (event.type === 'timeUpdate') {
        store.setCurrentTime(event.currentTime)
        store.setDuration(event.duration)
      }
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadChannel = useCallback(
    async (channel: Channel) => {
      store.setCurrentChannel(channel)
      store.setPlaybackState('loading')
      await service.load(channel.url)
    },
    [service, store],
  )

  const togglePlay = useCallback(() => {
    service.togglePlay()
  }, [service])

  const seek = useCallback(
    (time: number) => {
      service.seek(time)
    },
    [service],
  )

  const setVolume = useCallback(
    (volume: number) => {
      service.setVolume(volume)
      store.setVolume(volume)
    },
    [service, store],
  )

  const toggleMute = useCallback(() => {
    service.toggleMute()
    store.setMuted(!store.muted)
  }, [service, store])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }, [])

  return {
    videoRef,
    containerRef,
    ...store,
    loadChannel,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
  }
}
