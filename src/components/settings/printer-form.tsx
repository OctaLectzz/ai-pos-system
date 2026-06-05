'use client'

import { FormDialog } from '@/components/shared/form-dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCreatePrinter, useUpdatePrinter } from '@/hooks/use-printers'
import { printerSchema } from '@/schemas/receipt.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'

import type { PrinterInput } from '@/schemas/receipt.schema'
import type { Printer } from '@/types/receipt.types'

interface PrinterFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  printer: Printer | null
  scannedPrinters?: string[]
}

export function PrinterForm({ open, onOpenChange, printer, scannedPrinters = [] }: PrinterFormProps): React.JSX.Element {
  const t = useTranslations('receipt.printers')
  const tc = useTranslations('common')
  const isEditing = !!printer

  const createMutation = useCreatePrinter()
  const updateMutation = useUpdatePrinter()
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<PrinterInput>({
    resolver: zodResolver(printerSchema) as Resolver<PrinterInput>,
    defaultValues: {
      name: '',
      deviceName: '',
      type: 'THERMAL',
      isDefault: false,
      isActive: true
    }
  })

  useEffect(() => {
    if (printer) {
      reset({
        name: printer.name,
        deviceName: printer.deviceName,
        type: printer.type,
        isDefault: printer.isDefault,
        isActive: printer.isActive
      })
    } else {
      reset({
        name: '',
        deviceName: '',
        type: 'THERMAL',
        isDefault: false,
        isActive: true
      })
    }
  }, [printer, reset])

  function onSubmit(values: PrinterInput): void {
    if (isEditing && printer) {
      updateMutation.mutate({ id: printer.id, data: values }, { onSuccess: () => onOpenChange(false) })
    } else {
      createMutation.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t('edit') : t('addPrinter')}
      description={isEditing ? t('edit') : t('addPrinter')}
      onSubmit={handleSubmit(onSubmit)}
      cancelLabel={tc('cancel')}
      submitLabel={tc('save')}
      submitLoadingLabel={tc('loading')}
      isLoading={isLoading}
    >
      <FieldGroup>
        <Field>
          <FieldLabel required>{t('name')}</FieldLabel>
          <Input placeholder={t('namePlaceholder')} {...register('name')} disabled={isLoading} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel required>{t('deviceName')}</FieldLabel>
          {scannedPrinters.length > 0 ? (
            <Controller
              control={control}
              name="deviceName"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('deviceNamePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {scannedPrinters.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Input placeholder={t('deviceNamePlaceholder')} {...register('deviceName')} disabled={isLoading} />
          )}
          <FieldError errors={[errors.deviceName]} />
        </Field>

        <Field>
          <FieldLabel>{t('type')}</FieldLabel>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THERMAL">{t('typeThermal')}</SelectItem>
                  <SelectItem value="LABEL">{t('typeLabel')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Controller
          control={control}
          name="isDefault"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <FieldLabel className="cursor-pointer">{t('setDefault')}</FieldLabel>
              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
            </div>
          )}
        />
      </FieldGroup>
    </FormDialog>
  )
}
