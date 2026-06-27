import { Icon } from '../components/atoms/icon.tsx'

interface NavItem {
  label: string
  icon: string
  hash: string
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: 'home-icon', hash: '#/' },
  { label: 'Listas', icon: 'list-icon', hash: '#/listas' },
  { label: 'Ajustes', icon: 'settings-icon', hash: '#/configuracion' },
]

export function SidebarLayout() {
  const currentHash = window.location.hash || '#/'

  const navigate = (hash: string) => {
    window.history.pushState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return (
    <>
      {navItems.map((item) => (
        <button
          key={item.hash}
          onClick={() => navigate(item.hash)}
          className={`p-2.5 rounded-xl transition-colors ${
            currentHash === item.hash
              ? 'bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
          }`}
          aria-label={item.label}
          title={item.label}
        >
          <Icon name={item.icon} size={22} />
        </button>
      ))}
    </>
  )
}
