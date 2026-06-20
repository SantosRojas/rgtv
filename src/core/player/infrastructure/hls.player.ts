import Hls from 'hls.js'
import type { PlaybackState } from '../domain/playback-state.ts'
import { PlaybackError } from '../../shared/domain/errors.ts'

export type PlayerEvent =
  | { type: 'stateChange'; state: PlaybackState }
  | { type: 'error'; message: string }
  | { type: 'timeUpdate'; currentTime: number; duration: number }

export type PlayerEventListener = (event: PlayerEvent) => void

export class HlsPlayer {
  private video: HTMLVideoElement | null = null
  private hls: Hls | null = null
  private listeners: Set<PlayerEventListener> = new Set()
  private state: PlaybackState = 'idle'

  private setState(newState: PlaybackState) {
    this.state = newState
    this.emit({ type: 'stateChange', state: newState })
  }

  private emit(event: PlayerEvent) {
    for (const listener of this.listeners) {
      listener(event)
    }
  }

  on(listener: PlayerEventListener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState(): PlaybackState {
    return this.state
  }

  attach(video: HTMLVideoElement) {
    this.video = video
    this.bindEvents()
  }

  private bindEvents() {
    if (!this.video) return

    this.video.addEventListener('waiting', () => this.setState('buffering'))
    this.video.addEventListener('playing', () => this.setState('playing'))
    this.video.addEventListener('pause', () => this.setState('paused'))
    this.video.addEventListener('ended', () => this.setState('idle'))

    this.video.addEventListener('timeupdate', () => {
      this.emit({
        type: 'timeUpdate',
        currentTime: this.video!.currentTime,
        duration: this.video!.duration,
      })
    })

    this.video.addEventListener('error', () => {
      const error = this.video!.error
      this.setState('error')
      this.emit({ type: 'error', message: error?.message ?? 'Unknown media error' })
    })
  }

  async load(url: string): Promise<void> {
    if (!this.video) throw new PlaybackError('No video element attached')

    this.setState('loading')
    this.destroy()

    if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      this.video.src = url
    } else if (Hls.isSupported()) {
      this.hls = new Hls()
      this.hls.loadSource(url)
      this.hls.attachMedia(this.video)

      this.hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          this.setState('error')
          this.emit({ type: 'error', message: `HLS error: ${data.type}` })
        }
      })
    } else {
      throw new PlaybackError('HLS is not supported in this browser')
    }
  }

  play() {
    if (!this.video) return
    this.video.play().catch(() => {
      this.setState('error')
      this.emit({ type: 'error', message: 'Failed to play stream' })
    })
  }

  pause() {
    if (!this.video) return
    this.video.pause()
  }

  togglePlay() {
    if (!this.video) return
    if (this.video.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  seek(time: number) {
    if (!this.video) return
    this.video.currentTime = time
  }

  setVolume(volume: number) {
    if (!this.video) return
    this.video.volume = Math.max(0, Math.min(1, volume))
  }

  setMuted(muted: boolean) {
    if (!this.video) return
    this.video.muted = muted
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy()
      this.hls = null
    }
    if (this.video) {
      this.video.src = ''
    }
    this.state = 'idle'
  }
}
