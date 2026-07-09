import type { ReactNode } from 'react'
import { SidebarLayout } from './sidebar-layout.tsx'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <aside className="hidden lg:flex w-16 flex-shrink-0 flex-col bg-[var(--glass-bg)] backdrop-blur-md border-r border-[var(--glass-border)]">
        <div className="flex items-center justify-center h-14 border-b border-[var(--glass-border)]">
          <span className="text-lg font-bold text-[var(--color-accent-primary)]">RG</span>
        </div>
        <SidebarLayout />
      </aside>
      <main className="flex-1 overflow-hidden pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
