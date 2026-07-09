import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useSettingsStore } from '../../stores/settings.store.ts'

function applyAccent(accent: string, customAccent: string) {
  if (accent === 'custom') {
    document.documentElement.style.setProperty('--color-accent-primary', customAccent)
    const secondary = customAccent + '80'
    document.documentElement.style.setProperty('--color-accent-secondary', secondary)
  } else {
    document.documentElement.style.removeProperty('--color-accent-primary')
    document.documentElement.style.removeProperty('--color-accent-secondary')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode, accent, customAccent } = useSettingsStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent)
    applyAccent(accent, customAccent)
  }, [accent, customAccent])

  useEffect(() => {
    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        document.documentElement.setAttribute('data-mode', e.matches ? 'dark' : 'light')
      }
      handler(mq)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      document.documentElement.setAttribute('data-mode', mode)
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const current = document.documentElement.getAttribute('data-mode')
      const shouldBe = mq.matches ? 'dark' : 'light'
      if (current !== shouldBe) {
        document.documentElement.setAttribute('data-mode', shouldBe)
      }
    }
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [mode])

  return <>{children}</>
}
