'use client'

import { FormDialog } from '@/components/shared/form-dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-categories'
import { CreateCategoryInput, createCategorySchema } from '@/schemas/category.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'

import type { Category } from '@/types/category.types'

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryForm({ open, onOpenChange, category }: CategoryFormProps): React.JSX.Element {
  const t = useTranslations('categories')
  const tc = useTranslations('common')
  const isEditing = !!category

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema) as Resolver<CreateCategoryInput>,
    defaultValues: {
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true
    }
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        sortOrder: category.sortOrder,
        isActive: category.isActive
      })
    } else {
      reset({
        name: '',
        description: '',
        sortOrder: 0,
        isActive: true
      })
    }
  }, [category, reset])

  function onSubmit(values: CreateCategoryInput): void {
    if (isEditing && category) {
      updateMutation.mutate(
        { id: category.id, data: values },
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
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t('editCategory') : t('addCategory')}
      description={t('description')}
      onSubmit={handleSubmit(onSubmit)}
      cancelLabel={tc('cancel')}
      submitLabel={t('form.save')}
      submitLoadingLabel={t('form.saving')}
      isLoading={isLoading}
      maxWidthClassName="sm:max-w-md"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name" required>
            {t('form.name')}
          </FieldLabel>
          <Input id="name" placeholder={t('form.namePlaceholder')} {...register('name')} disabled={isLoading} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">{t('form.description')}</FieldLabel>
          <Textarea id="description" placeholder={t('form.descriptionPlaceholder')} {...register('description')} disabled={isLoading} />
          <FieldError errors={[errors.description]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="sortOrder">{t('form.sortOrder')}</FieldLabel>
          <Input id="sortOrder" type="number" placeholder={t('form.sortOrderPlaceholder')} {...register('sortOrder')} disabled={isLoading} />
          <FieldError errors={[errors.sortOrder]} />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FieldLabel htmlFor="isActive">{t('form.isActive')}</FieldLabel>
              <p className="text-muted-foreground text-xs">{t('form.isActiveDescription')}</p>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />}
            />
          </div>
        </Field>
      </FieldGroup>
    </FormDialog>
  )
}
