'use client'

import { ActionButton } from '@/components/shared/action-button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DataTable } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { useDeletePrinter, usePrinters, useSetDefaultPrinter } from '@/hooks/use-printers'
import { checkQzTrayConnection, scanQzPrinters } from '@/services/print-service'
import { Loader2, Plus, Printer, Radar, Star, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { PrinterForm } from './printer-form'

import type { DataTableColumn } from '@/components/shared/data-table'
import type { Printer as PrinterType } from '@/types/receipt.types'

export function PrinterList(): React.JSX.Element {
  const t = useTranslations('receipt.printers')
  const tc = useTranslations('common')
  const { data, isLoading } = usePrinters()
  const deleteMutation = useDeletePrinter()
  const setDefaultMutation = useSetDefaultPrinter()

  const [formOpen, setFormOpen] = useState(false)
  const [editPrinter, setEditPrinter] = useState<PrinterType | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PrinterType | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedPrinters, setScannedPrinters] = useState<string[]>([])
  const [qzConnected, setQzConnected] = useState<boolean | null>(null)

  const printers = data?.data || []

  const handleScan = useCallback(async () => {
    setIsScanning(true)
    try {
      const connected = await checkQzTrayConnection()
      setQzConnected(connected)
      if (connected) {
        const found = await scanQzPrinters()
        setScannedPrinters(found)
      }
    } finally {
      setIsScanning(false)
    }
  }, [])

  function handleDelete(): void {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
      }
    })
  }

  const handleSetDefault = useCallback(
    (id: string) => {
      setDefaultMutation.mutate(id)
    },
    [setDefaultMutation]
  )

  const columns: DataTableColumn<PrinterType>[] = [
    {
      key: 'name',
      header: t('name'),
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Printer className="text-primary h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.name}</p>
              {item.isDefault && <StatusBadge status="default" type="product" label={t('default')} />}
            </div>
            <p className="text-muted-foreground text-xs">{item.deviceName}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: t('type'),
      className: 'w-[100px]',
      render: (item) => <span className="text-muted-foreground text-sm">{item.type === 'THERMAL' ? t('typeThermal') : t('typeLabel')}</span>
    },
    {
      key: 'status',
      header: tc('active'),
      className: 'w-[100px]',
      render: (item) => (
        <StatusBadge status={item.isActive ? 'active' : 'inactive'} type="product" label={item.isActive ? t('active') : t('inactive')} />
      )
    },
    {
      key: 'actions',
      header: tc('actions'),
      className: 'w-[120px]',
      render: (item) => (
        <div className="flex items-center gap-1">
          {!item.isDefault && (
            <ActionButton
              tooltip={t('setDefault')}
              icon={<Star className="h-4 w-4" />}
              onClick={() => handleSetDefault(item.id)}
              className="text-muted-foreground hover:text-primary"
            />
          )}
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
      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          onClick={() => {
            setEditPrinter(null)
            setFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addPrinter')}
        </Button>
        <Button variant="outline" onClick={handleScan} disabled={isScanning}>
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Radar className="mr-2 h-4 w-4" />}
          {isScanning ? t('scanning') : t('scanPrinters')}
        </Button>
      </div>

      {/* QZ Tray status */}
      {qzConnected !== null && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
            qzConnected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          <div className={`h-2 w-2 rounded-full ${qzConnected ? 'bg-emerald-500' : 'bg-destructive'}`} />
          {qzConnected ? t('qzConnected') : t('qzNotConnected')}
        </div>
      )}

      {/* Printer table */}
      <DataTable
        columns={columns}
        data={printers}
        isLoading={isLoading}
        emptyState={<EmptyState icon={Printer} title={t('noPrintersFound')} description={t('noPrintersDescription')} />}
      />

      {/* Add/Edit Printer Dialog */}
      <PrinterForm open={formOpen} onOpenChange={setFormOpen} printer={editPrinter} scannedPrinters={scannedPrinters} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('delete')}
        description={t('deleteConfirm')}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
