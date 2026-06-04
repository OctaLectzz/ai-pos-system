import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
} as const

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps): React.JSX.Element {
  return <Loader2 className={cn('text-muted-foreground animate-spin', SIZES[size], className)} />
}
