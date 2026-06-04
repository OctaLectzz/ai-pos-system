import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon = PackageOpen, title, description, children, className }: EmptyStateProps): React.JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">{description}</p>
      {children}
    </div>
  )
}
