import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('../pages/home.page.tsx'))
const PlaylistsPage = lazy(() => import('../pages/playlists.page.tsx'))
const SettingsPage = lazy(() => import('../pages/settings.page.tsx'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-primary)]" />
    </div>
  )
}

function matchRoute(hash: string): { route: string; params: Record<string, string> } {
  const path = hash.replace(/^#\//, '') || ''

  if (path === 'listas') return { route: 'playlists', params: {} }
  if (path === 'configuracion') return { route: 'settings', params: {} }

  return { route: 'home', params: {} }
}

export interface AppRoutesProps {
  hash: string
}

export function AppRoutes({ hash }: AppRoutesProps) {
  const { route } = matchRoute(hash)

  return (
    <Suspense fallback={<PageLoader />}>
      {route === 'home' && <HomePage />}
      {route === 'playlists' && <PlaylistsPage />}
      {route === 'settings' && <SettingsPage />}
    </Suspense>
  )
}
