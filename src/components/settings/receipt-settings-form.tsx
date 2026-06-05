'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useReceiptSettings, useUpdateReceiptSettings } from '@/hooks/use-receipt-settings'
import { receiptSettingsSchema } from '@/schemas/receipt.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, Wifi } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form'

import type { ReceiptSettingsInput } from '@/schemas/receipt.schema'

interface ReceiptSettingsFormProps {
  onChange?: (values: Partial<ReceiptSettingsInput>) => void
}

export function ReceiptSettingsForm({ onChange }: ReceiptSettingsFormProps = {}): React.JSX.Element {
  const t = useTranslations('receipt.settings')
  const { data, isLoading } = useReceiptSettings()
  const updateMutation = useUpdateReceiptSettings()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<ReceiptSettingsInput>({
    resolver: zodResolver(receiptSettingsSchema) as Resolver<ReceiptSettingsInput>,
    defaultValues: {
      headerText: '',
      footerText: '',
      wifiName: '',
      wifiPassword: '',
      showLogo: false,
      showTax: true,
      showAddress: true,
      showPhone: true,
      paperWidth: 80
    }
  })

  // Populate form with fetched settings
  useEffect(() => {
    if (data?.data) {
      const s = data.data
      reset({
        headerText: s.headerText || '',
        footerText: s.footerText || '',
        wifiName: s.wifiName || '',
        wifiPassword: s.wifiPassword || '',
        showLogo: s.showLogo,
        showTax: s.showTax,
        showAddress: s.showAddress,
        showPhone: s.showPhone,
        paperWidth: s.paperWidth as 58 | 80
      })
    }
  }, [data, reset])

  const watchedValues = useWatch({ control })

  useEffect(() => {
    if (onChange) {
      onChange(watchedValues)
    }
  }, [watchedValues, onChange])

  function onSubmit(values: ReceiptSettingsInput): void {
    updateMutation.mutate({
      ...values,
      headerText: values.headerText || null,
      footerText: values.footerText || null,
      wifiName: values.wifiName || null,
      wifiPassword: values.wifiPassword || null
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header & Footer */}
      <Card>
        <CardHeader>
          <CardTitle>{t('headerText')}</CardTitle>
          <CardDescription>{t('headerTextDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>{t('headerText')}</FieldLabel>
              <Input placeholder={t('headerTextPlaceholder')} {...register('headerText')} disabled={updateMutation.isPending} />
              <FieldError errors={[errors.headerText]} />
            </Field>

            <Field>
              <FieldLabel>{t('footerText')}</FieldLabel>
              <Textarea
                placeholder={t('footerTextPlaceholder')}
                className="h-20 resize-none"
                {...register('footerText')}
                disabled={updateMutation.isPending}
              />
              <FieldDescription>{t('footerTextDescription')}</FieldDescription>
              <FieldError errors={[errors.footerText]} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Wi-Fi Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            {t('wifiSection')}
          </CardTitle>
          <CardDescription>{t('wifiSectionDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>{t('wifiName')}</FieldLabel>
              <Input placeholder={t('wifiNamePlaceholder')} {...register('wifiName')} disabled={updateMutation.isPending} />
              <FieldError errors={[errors.wifiName]} />
            </Field>

            <Field>
              <FieldLabel>{t('wifiPassword')}</FieldLabel>
              <Input placeholder={t('wifiPasswordPlaceholder')} {...register('wifiPassword')} disabled={updateMutation.isPending} />
              <FieldError errors={[errors.wifiPassword]} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle>{t('displayOptions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              control={control}
              name="showTax"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <FieldLabel className="cursor-pointer">{t('showTax')}</FieldLabel>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={updateMutation.isPending} />
                </div>
              )}
            />

            <Separator />

            <Controller
              control={control}
              name="showAddress"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <FieldLabel className="cursor-pointer">{t('showAddress')}</FieldLabel>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={updateMutation.isPending} />
                </div>
              )}
            />

            <Separator />

            <Controller
              control={control}
              name="showPhone"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <FieldLabel className="cursor-pointer">{t('showPhone')}</FieldLabel>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={updateMutation.isPending} />
                </div>
              )}
            />

            <Separator />

            <Controller
              control={control}
              name="showLogo"
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <FieldLabel className="cursor-pointer">{t('showLogo')}</FieldLabel>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={updateMutation.isPending} />
                </div>
              )}
            />

            <Separator />

            <Field>
              <FieldLabel>{t('paperWidth')}</FieldLabel>
              <Controller
                control={control}
                name="paperWidth"
                render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))} disabled={updateMutation.isPending}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58">{t('paperWidth58')}</SelectItem>
                      <SelectItem value="80">{t('paperWidth80')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.paperWidth]} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
        {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {t('save')}
      </Button>
    </form>
  )
}
