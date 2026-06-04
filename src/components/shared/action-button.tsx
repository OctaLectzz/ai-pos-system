'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import * as React from 'react'

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  tooltip: string
  icon: React.ReactNode
}

export function ActionButton({ tooltip, icon, variant = 'ghost', size = 'icon', ...props }: ActionButtonProps): React.JSX.Element {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} className="text-muted-foreground hover:text-foreground h-8 w-8" {...props}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
