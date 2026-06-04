'use client'

import { CategoryForm } from '@/components/categories/category-form'
import { CategoryList } from '@/components/categories/category-list'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { Category } from '@/types/category.types'

function CategoriesPageContent(): React.JSX.Element {
  const t = useTranslations('categories')
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  function handleEdit(category: Category): void {
    setEditCategory(category)
    setFormOpen(true)
  }

  function handleFormClose(open: boolean): void {
    setFormOpen(open)
    if (!open) {
      setEditCategory(null)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <PageHeader title={t('title')} description={t('description')}>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addCategory')}
        </Button>
      </PageHeader>

      <CategoryList onEdit={handleEdit} />

      <CategoryForm open={formOpen} onOpenChange={handleFormClose} category={editCategory} />
    </div>
  )
}

export default CategoriesPageContent
