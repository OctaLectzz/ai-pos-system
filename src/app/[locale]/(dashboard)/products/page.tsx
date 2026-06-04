'use client'

import { ProductForm } from '@/components/products/product-form'
import { ProductList } from '@/components/products/product-list'
import { StockAdjustmentDialog } from '@/components/products/stock-adjustment-dialog'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { Product } from '@/types/product.types'

function ProductsPageContent(): React.JSX.Element {
  const t = useTranslations('products')
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [stockProduct, setStockProduct] = useState<Product | null>(null)

  function handleEdit(product: Product): void {
    setEditProduct(product)
    setFormOpen(true)
  }

  function handleFormClose(open: boolean): void {
    setFormOpen(open)
    if (!open) {
      setEditProduct(null)
    }
  }

  function handleStockAdjust(product: Product): void {
    setStockProduct(product)
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <PageHeader title={t('title')} description={t('description')}>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addProduct')}
        </Button>
      </PageHeader>

      <ProductList onEdit={handleEdit} onStockAdjust={handleStockAdjust} />

      <ProductForm open={formOpen} onOpenChange={handleFormClose} product={editProduct} />

      <StockAdjustmentDialog open={!!stockProduct} onOpenChange={(open) => !open && setStockProduct(null)} product={stockProduct} />
    </div>
  )
}

export default ProductsPageContent
