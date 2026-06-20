import type { ReactNode } from 'react'

interface MainLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function MainLayout({ sidebar, children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <aside className="w-16 flex-shrink-0 bg-slate-900/40 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-4 gap-4">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
