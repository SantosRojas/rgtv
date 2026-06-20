import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useSettingsStore } from '../../stores/settings.store.ts'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
