import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusVariant = 'success' | 'warning' | 'destructive' | 'info' | 'muted'

interface StatusConfig {
  variant: StatusVariant
  className: string
}

const PRODUCT_STATUS_MAP: Record<string, StatusConfig> = {
  ACTIVE: { variant: 'success', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' },
  INACTIVE: { variant: 'muted', className: 'bg-muted text-muted-foreground border-border' },
  OUT_OF_STOCK: { variant: 'destructive', className: 'bg-destructive/10 text-destructive border-destructive/20' }
}

const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  NEW: { variant: 'info', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400' },
  CONFIRMED: { variant: 'info', className: 'bg-primary/10 text-primary border-primary/20' },
  PROCESSING: { variant: 'warning', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400' },
  COMPLETED: { variant: 'success', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' },
  CANCELLED: { variant: 'destructive', className: 'bg-destructive/10 text-destructive border-destructive/20' }
}

interface StatusBadgeProps {
  status: string
  type?: 'product' | 'order'
  label?: string
  className?: string
}

export function StatusBadge({ status, type = 'product', label, className }: StatusBadgeProps): React.JSX.Element {
  const statusMap = type === 'product' ? PRODUCT_STATUS_MAP : ORDER_STATUS_MAP
  const config = statusMap[status] || { variant: 'muted' as StatusVariant, className: '' }

  return (
    <Badge variant="outline" className={cn('font-medium', config.className, className)}>
      {label || status}
    </Badge>
  )
}
