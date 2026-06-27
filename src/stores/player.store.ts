import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'rgtv_player',
      partialize: (state) => ({ volume: state.volume, muted: state.muted }),
    },
  ),
)
