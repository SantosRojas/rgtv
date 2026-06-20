import { create } from 'zustand'
import type { PlaybackState } from '../core/player/domain/playback-state.ts'
import type { Channel } from '../core/channel/domain/channel.ts'

export interface PlayerStoreState {
  currentChannel: Channel | null
  playbackState: PlaybackState
  volume: number
  muted: boolean
  currentTime: number
  duration: number
  setCurrentChannel: (channel: Channel | null) => void
  setPlaybackState: (state: PlaybackState) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
}

export const usePlayerStore = create<PlayerStoreState>((set) => ({
  currentChannel: null,
  playbackState: 'idle',
  volume: 1,
  muted: false,
  currentTime: 0,
  duration: 0,

  setCurrentChannel: (currentChannel) => set({ currentChannel }),
  setPlaybackState: (playbackState) => set({ playbackState }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
}))
