'use client'

import { ActionButton } from '@/components/shared/action-button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchInput } from '@/components/shared/search-input'
import { StatusBadge } from '@/components/shared/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategories } from '@/hooks/use-categories'
import { useDeleteProduct, useProducts } from '@/hooks/use-products'
import { formatCurrency } from '@/utils/format-currency'
import { AlertTriangle, Package, PackageMinus, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import type { DataTableColumn } from '@/components/shared/data-table'
import type { Product, ProductStatus } from '@/types/product.types'

interface ProductListProps {
  onEdit: (product: Product) => void
  onStockAdjust: (product: Product) => void
}

export function ProductList({ onEdit, onStockAdjust }: ProductListProps): React.JSX.Element {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.data || []

  const { data, isLoading } = useProducts({
    search,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
    status: statusFilter !== 'all' ? (statusFilter as ProductStatus) : undefined
  })
  const deleteMutation = useDeleteProduct()

  const products = data?.data || []

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  function handleDelete(): void {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
      }
    })
  }

  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Package className="text-primary h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-muted-foreground text-xs">{item.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: t('table.category'),
      className: 'w-[140px]',
      render: (item) => <span className="text-muted-foreground text-sm">{item.category?.name ?? '-'}</span>
    },
    {
      key: 'price',
      header: t('table.price'),
      className: 'w-[140px]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
          {item.discountPrice && <p className="text-muted-foreground text-xs line-through">{formatCurrency(item.discountPrice)}</p>}
        </div>
      )
    },
    {
      key: 'stock',
      header: t('table.stock'),
      className: 'w-[100px]',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.stock <= item.minStockThreshold && item.stock > 0 && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
          <span
            className={
              item.stock === 0 ? 'text-destructive font-medium' : item.stock <= item.minStockThreshold ? 'font-medium text-amber-500' : 'text-sm'
            }
          >
            {item.stock} {item.unit}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: t('table.status'),
      className: 'w-[120px]',
      render: (item) => {
        const labelMap: Record<string, string> = {
          ACTIVE: t('form.statusActive'),
          INACTIVE: t('form.statusInactive'),
          OUT_OF_STOCK: t('form.statusOutOfStock')
        }
        return <StatusBadge status={item.status} type="product" label={labelMap[item.status]} />
      }
    },
    {
      key: 'actions',
      header: t('table.actions'),
      className: 'w-[120px]',
      render: (item) => (
        <div className="flex items-center gap-1">
          <ActionButton tooltip={tc('edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(item)} />
          <ActionButton tooltip={t('adjustStock')} icon={<PackageMinus className="h-4 w-4" />} onClick={() => onStockAdjust(item)} />
          <ActionButton
            tooltip={tc('delete')}
            icon={<Trash2 className="text-destructive h-4 w-4" />}
            onClick={() => setDeleteTarget(item)}
            className="hover:bg-destructive/10 hover:text-destructive"
          />
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput placeholder={t('search.placeholder')} value={search} onSearch={handleSearch} className="max-w-sm" />
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('filter.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filter.allCategories')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('filter.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filter.allStatuses')}</SelectItem>
              <SelectItem value="ACTIVE">{t('form.statusActive')}</SelectItem>
              <SelectItem value="INACTIVE">{t('form.statusInactive')}</SelectItem>
              <SelectItem value="OUT_OF_STOCK">{t('form.statusOutOfStock')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyState={<EmptyState icon={Package} title={t('empty.title')} description={t('empty.description')} />}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('dialog.deleteTitle')}
        description={t('dialog.deleteDescription')}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
