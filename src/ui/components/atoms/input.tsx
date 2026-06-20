import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string
}

export function Input({ className = '', icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg px-4 py-2 placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors ${icon ? 'pl-10' : ''} ${className}`}
        {...props}
      />
    </div>
  )
}
