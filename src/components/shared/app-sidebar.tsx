'use client'

import { Link, usePathname } from '@/i18n/routing'
import {
  BarChart3,
  Bot,
  FolderOpen,
  LayoutDashboard,
  MessageCircle,
  MonitorSpeaker,
  Package,
  Printer,
  Receipt,
  Settings,
  ShoppingCart
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tNav = useTranslations('nav')
  const tApp = useTranslations('app')
  const pathname = usePathname()

  const mainRoutes = [
    { label: tNav('dashboard'), icon: LayoutDashboard, href: '/dashboard', active: pathname === '/dashboard' },
    { label: tNav('pos'), icon: MonitorSpeaker, href: '/pos', active: pathname.startsWith('/pos') },
    { label: tNav('orders'), icon: ShoppingCart, href: '/orders', active: pathname.startsWith('/orders') }
  ]

  const inventoryRoutes = [
    { label: tNav('products'), icon: Package, href: '/products', active: pathname.startsWith('/products') },
    { label: tNav('categories'), icon: FolderOpen, href: '/categories', active: pathname.startsWith('/categories') }
  ]

  const analyticsRoutes = [
    { label: tNav('reports'), icon: BarChart3, href: '/reports', active: pathname.startsWith('/reports') },
    { label: 'AI Assistant', icon: Bot, href: '/ai-assistant', active: pathname.startsWith('/ai-assistant') },
    { label: 'WhatsApp', icon: MessageCircle, href: '/whatsapp', active: pathname.startsWith('/whatsapp') }
  ]

  const systemRoutes = [
    { label: tNav('receiptSettings'), icon: Receipt, href: '/settings/receipt', active: pathname.startsWith('/settings/receipt') },
    { label: tNav('printers'), icon: Printer, href: '/settings/printers', active: pathname.startsWith('/settings/printers') },
    { label: tNav('settings'), icon: Settings, href: '/settings', active: pathname === '/settings' }
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group-data-[collapsible=icon]:justify-center">
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold">{tApp('name')}</span>
                  <span className="text-muted-foreground text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {mainRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={route.active}
                    tooltip={route.label}
                    className="h-11 text-base group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! [&>svg]:size-5"
                  >
                    <Link href={route.href}>
                      <route.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {inventoryRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={route.active}
                    tooltip={route.label}
                    className="h-11 text-base group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! [&>svg]:size-5"
                  >
                    <Link href={route.href}>
                      <route.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {analyticsRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={route.active}
                    tooltip={route.label}
                    className="h-11 text-base group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! [&>svg]:size-5"
                  >
                    <Link href={route.href}>
                      <route.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {systemRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={route.active}
                    tooltip={route.label}
                    className="h-11 text-base group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! [&>svg]:size-5"
                  >
                    <Link href={route.href}>
                      <route.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
