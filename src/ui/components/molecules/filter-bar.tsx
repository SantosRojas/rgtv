import { Button } from '../atoms/button.tsx'

interface FilterBarProps {
  countries: string[]
  categories: string[]
  languages: string[]
  selectedCountry: string | undefined
  selectedCategory: string | undefined
  selectedLanguage: string | undefined
  favoritesOnly: boolean
  onCountryChange: (country: string | undefined) => void
  onCategoryChange: (category: string | undefined) => void
  onLanguageChange: (language: string | undefined) => void
  onFavoritesToggle: () => void
  onClear: () => void
}

export function FilterBar({
  countries,
  categories,
  languages,
  selectedCountry,
  selectedCategory,
  selectedLanguage,
  favoritesOnly,
  onCountryChange,
  onCategoryChange,
  onLanguageChange,
  onFavoritesToggle,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={selectedCountry ?? ''}
        onChange={(e) => onCountryChange(e.target.value || undefined)}
        className="bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]"
        aria-label="Filter by country"
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={selectedCategory ?? ''}
        onChange={(e) => onCategoryChange(e.target.value || undefined)}
        className="bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={selectedLanguage ?? ''}
        onChange={(e) => onLanguageChange(e.target.value || undefined)}
        className="bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]"
        aria-label="Filter by language"
      >
        <option value="">All Languages</option>
        {languages.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <Button
        variant={favoritesOnly ? 'primary' : 'secondary'}
        size="sm"
        onClick={onFavoritesToggle}
      >
        {favoritesOnly ? '⭐ Favorites' : '☆ Favorites'}
      </Button>

      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    </div>
  )
}
