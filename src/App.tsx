import { useState, useEffect } from 'react'
import { MainLayout } from './ui/layouts/main-layout.tsx'
import { AppRoutes } from './ui/routes/app.routes.tsx'
import { ErrorBoundary } from './ui/components/atoms/error-boundary.tsx'

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <ErrorBoundary>
      <MainLayout>
        <AppRoutes hash={hash} />
      </MainLayout>
    </ErrorBoundary>
  )
}

export default App
