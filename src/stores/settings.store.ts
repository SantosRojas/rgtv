import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeVariant = 'dark-slate' | 'dark-emerald' | 'dark-violet' | 'dark-cyan'

export interface SettingsStoreState {
  theme: ThemeVariant
  proxyUrl: string
  setTheme: (theme: ThemeVariant) => void
  setProxyUrl: (url: string) => void
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      theme: 'dark-slate',
      proxyUrl: '',

      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },

      setProxyUrl: (proxyUrl) => set({ proxyUrl }),
    }),
    {
      name: 'rgtv_settings',
    },
  ),
)
