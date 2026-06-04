'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/use-categories'
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products'
import { CreateProductInput, createProductSchema } from '@/schemas/product.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'

import type { Product } from '@/types/product.types'

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps): React.JSX.Element {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const isEditing = !!product

  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.data || []

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema) as Resolver<CreateProductInput>,
    defaultValues: {
      name: '',
      categoryId: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      minStockThreshold: 5,
      unit: 'pcs',
      status: 'ACTIVE'
    }
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        categoryId: product.categoryId,
        sku: product.sku,
        description: product.description || '',
        price: product.price,
        discountPrice: product.discountPrice ?? undefined,
        costPrice: product.costPrice ?? undefined,
        stock: product.stock,
        minStockThreshold: product.minStockThreshold,
        unit: product.unit,
        weight: product.weight ?? undefined,
        status: product.status
      })
    } else {
      reset({
        name: '',
        categoryId: '',
        sku: '',
        description: '',
        price: 0,
        stock: 0,
        minStockThreshold: 5,
        unit: 'pcs',
        status: 'ACTIVE'
      })
    }
  }, [product, reset])

  function onSubmit(values: CreateProductInput): void {
    if (isEditing && product) {
      updateMutation.mutate(
        { id: product.id, data: values },
        {
          onSuccess: (response) => {
            if (response.success) {
              onOpenChange(false)
            }
          }
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: (response) => {
          if (response.success) {
            onOpenChange(false)
          }
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('editProduct') : t('addProduct')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{t('form.name')}</FieldLabel>
              <Input id="name" placeholder={t('form.namePlaceholder')} {...register('name')} disabled={isLoading} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="categoryId">{t('form.category')}</FieldLabel>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('form.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.categoryId]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="sku">{t('form.sku')}</FieldLabel>
              <Input id="sku" placeholder={t('form.skuPlaceholder')} {...register('sku')} disabled={isLoading} />
              <FieldError errors={[errors.sku]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">{t('form.description')}</FieldLabel>
              <Textarea id="description" placeholder={t('form.descriptionPlaceholder')} {...register('description')} disabled={isLoading} />
              <FieldError errors={[errors.description]} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="price">{t('form.price')}</FieldLabel>
                <Input id="price" type="number" placeholder={t('form.pricePlaceholder')} {...register('price')} disabled={isLoading} />
                <FieldError errors={[errors.price]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="discountPrice">{t('form.discountPrice')}</FieldLabel>
                <Input
                  id="discountPrice"
                  type="number"
                  placeholder={t('form.discountPricePlaceholder')}
                  {...register('discountPrice')}
                  disabled={isLoading}
                />
                <FieldError errors={[errors.discountPrice]} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="costPrice">{t('form.costPrice')}</FieldLabel>
                <Input id="costPrice" type="number" placeholder={t('form.costPricePlaceholder')} {...register('costPrice')} disabled={isLoading} />
                <FieldError errors={[errors.costPrice]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="stock">{t('form.stock')}</FieldLabel>
                <Input id="stock" type="number" placeholder={t('form.stockPlaceholder')} {...register('stock')} disabled={isLoading} />
                <FieldError errors={[errors.stock]} />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="minStockThreshold">{t('form.minStockThreshold')}</FieldLabel>
                <Input
                  id="minStockThreshold"
                  type="number"
                  placeholder={t('form.minStockThresholdPlaceholder')}
                  {...register('minStockThreshold')}
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="unit">{t('form.unit')}</FieldLabel>
                <Input id="unit" placeholder={t('form.unitPlaceholder')} {...register('unit')} disabled={isLoading} />
              </Field>

              <Field>
                <FieldLabel htmlFor="weight">{t('form.weight')}</FieldLabel>
                <Input id="weight" type="number" step="0.01" placeholder={t('form.weightPlaceholder')} {...register('weight')} disabled={isLoading} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="status">{t('form.status')}</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">{t('form.statusActive')}</SelectItem>
                      <SelectItem value="INACTIVE">{t('form.statusInactive')}</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">{t('form.statusOutOfStock')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {tc('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('form.saving') : t('form.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
