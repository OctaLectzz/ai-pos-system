'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onSearch: (value: string) => void
  debounceMs?: number
  className?: string
}

export function SearchInput({
  placeholder = 'Search...',
  value: externalValue = '',
  onSearch,
  debounceMs = 300,
  className
}: SearchInputProps): React.JSX.Element {
  const [internalValue, setInternalValue] = useState(externalValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setInternalValue(externalValue)
  }, [externalValue])

  const debouncedSearch = useCallback(
    (searchValue: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        onSearch(searchValue)
      }, debounceMs)
    },
    [onSearch, debounceMs]
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value
    setInternalValue(newValue)
    debouncedSearch(newValue)
  }

  function handleClear(): void {
    setInternalValue('')
    onSearch('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
      <Input placeholder={placeholder} value={internalValue} onChange={handleChange} className="pr-9 pl-9" />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
