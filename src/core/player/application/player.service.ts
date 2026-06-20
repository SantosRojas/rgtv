import { HlsPlayer } from '../infrastructure/hls.player.ts'
import type { PlaybackState } from '../domain/playback-state.ts'

export interface PlayerServiceState {
  state: PlaybackState
  currentTime: number
  duration: number
  volume: number
  muted: boolean
}

export class PlayerService {
  readonly player: HlsPlayer
  private _state: PlayerServiceState = {
    state: 'idle',
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
  }

  constructor(player: HlsPlayer) {
    this.player = player
    this.player.on((event) => {
      if (event.type === 'stateChange') {
        this._state = { ...this._state, state: event.state }
      }
      if (event.type === 'timeUpdate') {
        this._state = { ...this._state, currentTime: event.currentTime, duration: event.duration }
      }
    })
  }

  get state(): PlayerServiceState {
    return this._state
  }

  async load(url: string) {
    await this.player.load(url)
  }

  togglePlay() {
    this.player.togglePlay()
  }

  seek(time: number) {
    this.player.seek(time)
  }

  setVolume(volume: number) {
    this.player.setVolume(volume)
    this._state = { ...this._state, volume }
  }

  toggleMute() {
    const muted = !this._state.muted
    this.player.setMuted(muted)
    this._state = { ...this._state, muted }
  }

  destroy() {
    this.player.destroy()
  }
}
