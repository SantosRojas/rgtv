import { useState, useRef, useEffect } from 'react'
import { Button } from '../atoms/button.tsx'

interface FilterBarProps {
  categories: string[]
  selectedCategory: string | undefined
  favoritesOnly: boolean
  onCategoryChange: (category: string | undefined) => void
  onFavoritesToggle: () => void
  onClear: () => void
}

function CategoryDropdown({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: string[]
  selectedCategory: string | undefined
  onCategoryChange: (category: string | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    const items = listRef.current?.querySelectorAll<HTMLButtonElement>('button')
    if (!items || items.length === 0) return

    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement)

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next = (currentIndex + 1) % items.length
        items[next]?.focus()
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = (currentIndex - 1 + items.length) % items.length
        items[prev]?.focus()
        break
      }
      case 'Home': {
        e.preventDefault()
        items[0]?.focus()
        break
      }
      case 'End': {
        e.preventDefault()
        items[items.length - 1]?.focus()
        break
      }
      case 'Escape': {
        e.preventDefault()
        setOpen(false)
        ref.current?.querySelector<HTMLButtonElement>('[aria-label="Filtrar por categoría"]')?.focus()
        break
      }
    }
  }

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-(--color-surface) text-(--color-text-primary) border border-(--color-border) rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-(--color-accent-primary) w-full lg:w-auto max-w-full"
        aria-label="Filtrar por categoría"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate min-w-0">{selectedCategory ?? 'Todas las categorías'}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 mt-1 z-50 min-w-50 w-full lg:min-w-60 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-xl backdrop-blur-md max-h-70 overflow-y-auto"
        >
          <button
            role="option"
            aria-selected={selectedCategory === undefined}
            onClick={() => {
              onCategoryChange(undefined)
              setOpen(false)
            }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
              selectedCategory === undefined ? 'text-(--color-accent-primary) font-medium' : 'text-(--color-text-secondary)'
            }`}
          >
            Todas las categorías
          </button>
          {categories.map((c) => (
            <button
              key={c}
              role="option"
              aria-selected={selectedCategory === c}
              onClick={() => {
                onCategoryChange(c)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/5 flex items-center justify-between ${
                selectedCategory === c ? 'text-(--color-accent-primary) font-medium' : 'text-(--color-text-primary)'
              }`}
            >
              {c}
              {selectedCategory === c && <span className="text-(--color-accent-primary)">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function FilterBar({
  categories,
  selectedCategory,
  favoritesOnly,
  onCategoryChange,
  onFavoritesToggle,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CategoryDropdown
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      <Button
        variant={favoritesOnly ? 'primary' : 'secondary'}
        size="sm"
        onClick={onFavoritesToggle}
      >
        {favoritesOnly ? '⭐ Favoritos' : '☆ Favoritos'}
      </Button>

      <Button variant="ghost" size="sm" onClick={onClear}>
        Limpiar
      </Button>
    </div>
  )
}
