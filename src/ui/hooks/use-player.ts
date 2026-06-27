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

  const currentChannel = usePlayerStore((s) => s.currentChannel)
  const playbackState = usePlayerStore((s) => s.playbackState)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const setCurrentChannel = usePlayerStore((s) => s.setCurrentChannel)
  const setPlaybackState = usePlayerStore((s) => s.setPlaybackState)
  const setVolumeAction = usePlayerStore((s) => s.setVolume)
  const setMutedAction = usePlayerStore((s) => s.setMuted)
  const setCurrentTimeAction = usePlayerStore((s) => s.setCurrentTime)
  const setDurationAction = usePlayerStore((s) => s.setDuration)

  useEffect(() => {
    if (videoRef.current) {
      service.player.attach(videoRef.current)
    }

    const unsubscribe = service.player.on((event) => {
      if (event.type === 'stateChange') {
        setPlaybackState(event.state)
      }
      if (event.type === 'timeUpdate') {
        setCurrentTimeAction(event.currentTime)
        setDurationAction(event.duration)
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

  return {
    videoRef,
    containerRef,
    currentChannel,
    playbackState,
    volume,
    muted,
    currentTime,
    duration,
    loadChannel,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
  }
}
