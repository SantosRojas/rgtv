import { useCallback, useState, useEffect } from 'react'
import { Icon } from '../components/atoms/icon.tsx'

const navItems = [
  { label: 'Inicio', icon: 'home-icon', hash: '#/' },
  { label: 'Ajustes', icon: 'settings-icon', hash: '#/configuracion' },
]

export function SidebarLayout() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHashChange = () => setCurrentHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((hash: string) => {
    window.history.pushState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }, [])

  return (
    <>
      <nav className="hidden lg:flex flex-col items-center py-4 gap-2 px-2">
        {navItems.map((item) => {
          const isActive = currentHash === item.hash
          return (
            <button
              key={item.hash}
              onClick={() => navigate(item.hash)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-full ${
                isActive
                  ? 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] shadow-[0_0_12px_-2px_var(--color-accent-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon name={item.icon} size={22} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-2 bg-[var(--glass-bg)] backdrop-blur-xl border-t border-[var(--glass-border)] safe-area-bottom">
        {navItems.map((item) => {
          const isActive = currentHash === item.hash
          return (
            <button
              key={item.hash}
              onClick={() => navigate(item.hash)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[var(--color-accent-primary)]'
                  : 'text-[var(--color-text-secondary)]'
              }`}
              aria-label={item.label}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
