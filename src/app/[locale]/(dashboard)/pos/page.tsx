'use client'

import { PosCart } from '@/components/pos/pos-cart'
import { PosProductGrid } from '@/components/pos/pos-product-grid'
import { useCategories } from '@/hooks/use-categories'
import { useProducts } from '@/hooks/use-products'
import { useState } from 'react'

import type { OrderItem } from '@/types/order.types'
import type { Product } from '@/types/product.types'

export default function PosPage(): React.JSX.Element {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ pageSize: 100 })
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({ pageSize: 50, isActive: true })

  const products = productsData?.data || []
  const categories = categoriesData?.data || []

  const [items, setItems] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')

  const handleAddToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product.id)

      const unitPrice = product.discountPrice ? Number(product.discountPrice) : Number(product.price)

      if (existingItem) {
        // Only increment if we have enough stock
        if (existingItem.quantity >= product.stock) {
          return currentItems
        }

        return currentItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * unitPrice
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          id: crypto.randomUUID(), // Local ID for UI only
          orderId: '', // Will be set on server
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice,
          subtotal: unitPrice
        }
      ]
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (!product || quantity > product.stock) {
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId))
  }

  const handleClearCart = () => {
    setItems([])
  }

  const isLoading = isLoadingProducts || isLoadingCategories

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-5 p-5 lg:flex-row">
      <div className="bg-card flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm">
        <PosProductGrid products={products} categories={categories} onAddToCart={handleAddToCart} isLoading={isLoading} />
      </div>

      <div className="flex h-[600px] w-full shrink-0 flex-col overflow-hidden lg:h-full lg:w-[200px] xl:w-[250px]">
        <PosCart
          items={items}
          products={products}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          notes={notes}
          setNotes={setNotes}
        />
      </div>
    </div>
  )
}
