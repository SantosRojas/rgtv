import { useEffect, useRef, useCallback, useState } from 'react'
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
  const [isZoomed, setIsZoomed] = useState(false)

  const currentChannel = usePlayerStore((s) => s.currentChannel)
  const playbackState = usePlayerStore((s) => s.playbackState)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const setCurrentChannel = usePlayerStore((s) => s.setCurrentChannel)
  const setPlaybackState = usePlayerStore((s) => s.setPlaybackState)
  const setVolumeAction = usePlayerStore((s) => s.setVolume)
  const setMutedAction = usePlayerStore((s) => s.setMuted)

  useEffect(() => {
    if (videoRef.current) {
      service.player.attach(videoRef.current)
    }

    const unsubscribe = service.player.on((event) => {
      if (event.type === 'stateChange') {
        setPlaybackState(event.state)
      }
    })

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadChannel = useCallback(
    async (channel: Channel) => {
      setCurrentChannel(channel)
      setPlaybackState('loading')
      try {
        await service.load(channel.url)
      } catch {
        setPlaybackState('error')
      }
    },
    [service, setCurrentChannel, setPlaybackState],
  )

  const setVolume = useCallback(
    (volume: number) => {
      service.setVolume(volume)
      setVolumeAction(volume)
    },
    [service, setVolumeAction],
  )

  const toggleMute = useCallback(() => {
    service.toggleMute()
    setMutedAction(!muted)
  }, [service, muted, setMutedAction])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }, [])

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev)
  }, [])

  return {
    videoRef,
    containerRef,
    currentChannel,
    playbackState,
    volume,
    muted,
    isZoomed,
    loadChannel,
    setVolume,
    toggleMute,
    toggleFullscreen,
    toggleZoom,
  }
}
