import { AppHeader } from '@/components/shared/app-header'
import { AppSidebar } from '@/components/shared/app-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen font-sans antialiased">
      <AppSidebar className="border-sidebar-border hidden w-64 shrink-0 border-r lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />

        <main className="bg-muted/20 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
