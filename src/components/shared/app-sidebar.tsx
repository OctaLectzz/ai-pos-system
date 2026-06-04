'use client'

import { Link, usePathname } from '@/i18n/routing'
import { BarChart3, Bot, FolderOpen, LayoutDashboard, MessageCircle, MonitorSpeaker, Package, Settings, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile?: boolean
}

export function AppSidebar({ className, isMobile, ...props }: AppSidebarProps) {
  const tNav = useTranslations('nav')
  const tApp = useTranslations('app')
  const pathname = usePathname()

  const routes = [
    {
      label: tNav('dashboard'),
      icon: LayoutDashboard,
      href: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      label: tNav('products'),
      icon: Package,
      href: '/products',
      active: pathname.startsWith('/products')
    },
    {
      label: tNav('categories'),
      icon: FolderOpen,
      href: '/categories',
      active: pathname.startsWith('/categories')
    },
    {
      label: tNav('orders'),
      icon: ShoppingCart,
      href: '/orders',
      active: pathname.startsWith('/orders')
    },
    {
      label: tNav('pos'),
      icon: MonitorSpeaker,
      href: '/pos',
      active: pathname.startsWith('/pos')
    },
    {
      label: tNav('reports'),
      icon: BarChart3,
      href: '/reports',
      active: pathname.startsWith('/reports')
    },
    {
      label: 'AI Assistant', // We can add translation for this later
      icon: Bot,
      href: '/ai-assistant',
      active: pathname.startsWith('/ai-assistant')
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: '/whatsapp',
      active: pathname.startsWith('/whatsapp')
    },
    {
      label: tNav('settings'),
      icon: Settings,
      href: '/settings',
      active: pathname.startsWith('/settings')
    }
  ]

  return (
    <div className={cn('bg-sidebar-background text-sidebar-foreground flex h-full flex-col', className)} {...props}>
      <div className="border-sidebar-border flex h-16 shrink-0 items-center border-b px-6">
        <Link href="/dashboard" className="text-primary flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span>{tApp('name')}</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 overflow-auto py-4">
        <nav className="flex flex-col gap-1 px-4">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  route.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', route.active ? 'text-primary' : '')} />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
