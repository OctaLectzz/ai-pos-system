'use client'

import { ActionButton } from '@/components/shared/action-button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { SearchInput } from '@/components/shared/search-input'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCategories, useDeleteCategory } from '@/hooks/use-categories'
import { FolderOpen, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import type { DataTableColumn } from '@/components/shared/data-table'
import type { Category } from '@/types/category.types'

interface CategoryListProps {
  onEdit: (category: Category) => void
}

export function CategoryList({ onEdit }: CategoryListProps): React.JSX.Element {
  const t = useTranslations('categories')
  const tc = useTranslations('common')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data, isLoading } = useCategories({ search })
  const deleteMutation = useDeleteCategory()

  const categories = data?.data || []

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

  const columns: DataTableColumn<Category>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <FolderOpen className="text-primary h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            {item.description && <p className="text-muted-foreground max-w-xs truncate text-xs">{item.description}</p>}
          </div>
        </div>
      )
    },
    {
      key: 'products',
      header: t('table.products'),
      className: 'w-[100px]',
      render: (item) => <span className="text-muted-foreground text-sm">{item._count?.products ?? 0}</span>
    },
    {
      key: 'sortOrder',
      header: t('table.sortOrder'),
      className: 'w-[80px]',
      render: (item) => <span className="text-muted-foreground text-sm">{item.sortOrder}</span>
    },
    {
      key: 'status',
      header: t('table.status'),
      className: 'w-[100px]',
      render: (item) => (
        <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} type="product" label={item.isActive ? t('table.active') : t('table.inactive')} />
      )
    },
    {
      key: 'actions',
      header: t('table.actions'),
      className: 'w-[100px]',
      render: (item) => (
        <div className="flex items-center gap-1">
          <ActionButton tooltip={tc('edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(item)} />
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
      <SearchInput placeholder={t('search.placeholder')} value={search} onSearch={handleSearch} className="max-w-sm" />

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyState={<EmptyState icon={FolderOpen} title={t('empty.title')} description={t('empty.description')} />}
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
