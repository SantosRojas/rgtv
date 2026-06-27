import { useState, useEffect } from 'react'
import { Input } from '../atoms/input.tsx'
import { Icon } from '../atoms/icon.tsx'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = 'Buscar canales...' }: SearchBarProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary)">
        <Icon name="search-icon" size={16} />
      </span>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10"
        aria-label="Buscar canales"
      />
    </div>
  )
}
