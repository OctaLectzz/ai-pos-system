import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DataTableColumn<T> {
  key: string
  header: string
  className?: string
  render: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  className?: string
  skeletonRows?: number
}

export function DataTable<T>({ columns, data, isLoading = false, emptyState, className, skeletonRows = 5 }: DataTableProps<T>): React.JSX.Element {
  if (isLoading) {
    return (
      <div className={cn('bg-card rounded-xl border shadow-sm', className)}>
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b-0 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn('text-muted-foreground h-11 px-4 text-xs font-semibold tracking-wider uppercase', col.className)}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <TableRow key={rowIdx} className="border-b-muted/40">
                {columns.map((col) => (
                  <TableCell key={col.key} className="px-4 py-4">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className={cn('bg-card overflow-hidden rounded-xl border shadow-sm', className)}>
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b-0 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn('text-muted-foreground h-11 px-4 text-xs font-semibold tracking-wider uppercase', col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx} className="border-b-muted/40 hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors">
              {columns.map((col) => (
                <TableCell key={col.key} className={cn('px-4 py-3.5', col.className)}>
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export type { DataTableColumn }
