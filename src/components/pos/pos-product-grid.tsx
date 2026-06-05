'use client'

import { SearchInput } from '@/components/shared/search-input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/utils/format-currency'
import { PackageOpen, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import type { Category } from '@/types/category.types'
import type { Product } from '@/types/product.types'

interface PosProductGridProps {
  products: Product[]
  categories: Category[]
  onAddToCart: (product: Product) => void
  isLoading?: boolean
}

// Helper to get initials from product name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Helper to get a deterministic beautiful gradient based on product ID
const getGradient = (id: string) => {
  const gradients = [
    'from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-400',
    'from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-400',
    'from-rose-500/20 to-pink-500/20 text-rose-700 dark:text-rose-400',
    'from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400',
    'from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-400',
    'from-violet-500/20 to-fuchsia-500/20 text-violet-700 dark:text-violet-400'
  ]
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[index % gradients.length]
}

export function PosProductGrid({ products, categories, onAddToCart, isLoading = false }: PosProductGridProps): React.JSX.Element {
  const t = useTranslations('pos')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === 'ALL' || product.categoryId === activeCategory

      // Only show active products in POS
      const isActive = product.status === 'ACTIVE' || product.status === 'OUT_OF_STOCK'

      return matchesSearch && matchesCategory && isActive
    })
  }, [products, searchQuery, activeCategory])

  if (isLoading) {
    return (
      <div className="flex h-full flex-col space-y-4 p-5">
        <div className="bg-muted h-12 w-full max-w-sm animate-pulse rounded-xl" />
        <div className="bg-muted mt-2 h-10 w-full animate-pulse rounded-full" />
        <div className="grid grid-cols-2 gap-5 pt-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-muted aspect-[4/5] animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-card border-b px-5 py-5 pb-4">
        <SearchInput
          value={searchQuery}
          onSearch={setSearchQuery}
          placeholder={t('grid.search')}
          className="[&>input]:bg-muted/50 focus-within:[&>input]:bg-background w-full transition-colors [&>input]:h-11 [&>input]:rounded-xl"
        />

        {/* Categories Pill Navigation */}
        <ScrollArea className="mt-5 w-full pb-1 whitespace-nowrap">
          <div className="flex w-max space-x-2.5">
            <button
              className={`rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                activeCategory === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
              onClick={() => setActiveCategory('ALL')}
            >
              {t('grid.allCategories')}
            </button>

            {categories
              .filter((c) => c.isActive)
              .map((category) => (
                <button
                  key={category.id}
                  className={`rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Product Grid Section */}
      <ScrollArea className="bg-muted/10 flex-1 px-5 pt-5">
        {filteredProducts.length === 0 ? (
          <div className="text-muted-foreground flex h-[400px] flex-col items-center justify-center text-center">
            <div className="bg-muted/50 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <PackageOpen className="h-10 w-10 opacity-40" />
            </div>
            <p className="text-foreground text-lg font-semibold tracking-tight">No products found</p>
            <p className="mt-1.5 text-sm">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-24 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0
              const price = product.discountPrice ? Number(product.discountPrice) : Number(product.price)
              const hasDiscount = !!product.discountPrice

              return (
                <div
                  key={product.id}
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOutOfStock
                      ? 'opacity-60 grayscale'
                      : 'border-border/50 bg-card hover:border-primary/40 hover:shadow-primary/5 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                  onClick={() => !isOutOfStock && onAddToCart(product)}
                >
                  {/* Product Image Area (using beautiful gradients + initials) */}
                  <div className={`relative flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br ${getGradient(product.id)}`}>
                    <span className="text-5xl font-black tracking-tighter opacity-60 transition-transform duration-500 group-hover:scale-110">
                      {getInitials(product.name)}
                    </span>

                    {/* Stock / Promo Overlays */}
                    {isOutOfStock && (
                      <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
                        <Badge variant="destructive" className="font-bold tracking-widest uppercase shadow-lg">
                          {t('grid.outOfStock')}
                        </Badge>
                      </div>
                    )}

                    {!isOutOfStock && hasDiscount && (
                      <Badge className="absolute top-3 left-3 z-10 bg-rose-500 shadow-md hover:bg-rose-600">{t('grid.promo')}</Badge>
                    )}

                    {!isOutOfStock && product.stock <= product.minStockThreshold && product.stock > 0 && (
                      <Badge className="absolute top-3 right-3 z-10 border-none bg-amber-500 text-white shadow-md hover:bg-amber-600">
                        {t('grid.lowStock', { stock: product.stock })}
                      </Badge>
                    )}

                    {/* Interactive "Add to Cart" Hover Overlay */}
                    {!isOutOfStock && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 dark:bg-white/5">
                        <div className="bg-primary text-primary-foreground flex h-14 w-14 scale-75 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-100">
                          <Plus className="h-7 w-7" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info Area */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="text-muted-foreground/80 text-xs font-bold tracking-widest uppercase">
                      {categories.find((c) => c.id === product.categoryId)?.name || t('grid.uncategorized')}
                    </div>

                    <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-semibold transition-colors">{product.name}</h3>

                    <div className="mt-auto pt-3">
                      <div>
                        <div className="text-foreground text-base font-extrabold tracking-tight">{formatCurrency(price)}</div>
                        {hasDiscount && (
                          <div className="text-muted-foreground/70 text-xs font-medium line-through">{formatCurrency(Number(product.price))}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
