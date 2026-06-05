'use client'

import { BackButton } from '@/components/shared/back-button'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Bluetooth, CheckCircle2, Download, Laptop, Monitor, Printer, Settings2, Smartphone, Usb } from 'lucide-react'
import { useTranslations } from 'next-intl'

function StepItem({ number, text }: { number: number; text: string }): React.JSX.Element {
  return (
    <div className="flex gap-3">
      <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">{number}</div>
      <div className="pt-0.5 text-sm">{text}</div>
    </div>
  )
}

export default function PrinterGuidePage(): React.JSX.Element {
  const t = useTranslations('receipt.guide')

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <BackButton href="/settings/printers" />
        <PageHeader title={t('title')} className="flex-1" />
      </div>

      <p className="text-muted-foreground max-w-2xl text-sm">{t('description')}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Desktop - QZ Tray */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>{t('desktopTitle')}</CardTitle>
                <CardDescription>{t('desktopDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <StepItem number={1} text={t('desktopStep1')} />
            <StepItem number={2} text={t('desktopStep2')} />
            <StepItem number={3} text={t('desktopStep3')} />
            <StepItem number={4} text={t('desktopStep4')} />
            <StepItem number={5} text={t('desktopStep5')} />
            <StepItem number={6} text={t('desktopStep6')} />
            <StepItem number={7} text={t('desktopStep7')} />
            <StepItem number={8} text={t('desktopStep8')} />
          </CardContent>
        </Card>

        {/* Mobile - RawBT */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle>{t('mobileTitle')}</CardTitle>
                <CardDescription>{t('mobileDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <StepItem number={1} text={t('mobileStep1')} />
            <StepItem number={2} text={t('mobileStep2')} />
            <StepItem number={3} text={t('mobileStep3')} />
            <StepItem number={4} text={t('mobileStep4')} />
            <StepItem number={5} text={t('mobileStep5')} />
            <StepItem number={6} text={t('mobileStep6')} />
          </CardContent>
        </Card>

        {/* iOS Limitations */}
        <Card className="border-amber-500/30 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle>{t('iosTitle')}</CardTitle>
                <CardDescription>{t('iosDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted/50 space-y-2 rounded-lg p-4 text-sm">
              <p>• {t('iosNote1')}</p>
              <p>• {t('iosNote2')}</p>
              <p>• {t('iosNote3')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              {t('requirementsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Laptop className="text-muted-foreground h-4 w-4 shrink-0" />
                <span>{t('requirementDesktop')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Download className="text-muted-foreground h-4 w-4 shrink-0" />
                <span>{t('requirementJava')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Printer className="text-muted-foreground h-4 w-4 shrink-0" />
                <span>{t('requirementPrinter')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Usb className="text-muted-foreground h-4 w-4 shrink-0" />
                <span>{t('requirementUsb')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Bluetooth className="text-muted-foreground h-4 w-4 shrink-0" />
                <span>{t('requirementBluetooth')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              {t('troubleshootTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>• {t('troubleshoot1')}</p>
              <p>• {t('troubleshoot2')}</p>
              <p>• {t('troubleshoot3')}</p>
              <p>• {t('troubleshoot4')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
