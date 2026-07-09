import type { ReactNode } from 'react'

interface GlassPanelProps {
  title?: string
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md'
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
}

export function GlassPanel({ title, children, className = '', padding = 'md' }: GlassPanelProps) {
  return (
    <section className={`bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] shadow-xl rounded-xl ${paddingStyles[padding]} ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
