import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'favorite' | 'category'
  children: ReactNode
}

const variantStyles = {
  default: 'bg-[var(--glass-bg)] text-[var(--color-text-secondary)] border border-[var(--glass-border)]',
  favorite: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  category: 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/20',
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}
