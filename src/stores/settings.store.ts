import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'light' | 'system'
export type AccentVariant = 'purple' | 'emerald' | 'violet' | 'cyan' | 'amber' | 'rose' | 'blue' | 'sky' | 'custom'

export interface SettingsStoreState {
  mode: ThemeMode
  accent: AccentVariant
  customAccent: string
  proxyUrl: string
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentVariant) => void
  setCustomAccent: (color: string) => void
  setProxyUrl: (url: string) => void
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      mode: 'dark',
      accent: 'purple',
      customAccent: '#c084fc',
      proxyUrl: '',

      setMode: (mode) => set({ mode }),

      setAccent: (accent) => set({ accent }),

      setCustomAccent: (customAccent) => {
        set({ customAccent, accent: 'custom' })
      },

      setProxyUrl: (proxyUrl) => set({ proxyUrl }),
    }),
    {
      name: 'rgtv_settings',
    },
  ),
)
