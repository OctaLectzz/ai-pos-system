'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  cancelLabel: string
  submitLabel: string
  submitLoadingLabel: string
  isLoading?: boolean
  maxWidthClassName?: string
  footer?: React.ReactNode
  children: React.ReactNode
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  cancelLabel,
  submitLabel,
  submitLoadingLabel,
  isLoading = false,
  maxWidthClassName = 'sm:max-w-md',
  footer,
  children
}: FormDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0', maxWidthClassName)}>
        <DialogHeader className="shrink-0 border-b p-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">{children}</div>

          <DialogFooter className="bg-muted/30 mx-0 mt-0 mb-0 shrink-0 rounded-b-xl border-t p-4">
            {footer !== undefined ? (
              footer
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  {cancelLabel}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? submitLoadingLabel : submitLabel}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
