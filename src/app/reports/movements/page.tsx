import { requirePermissionPage } from "@/lib/permissions"
import { db } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft } from "lucide-react"
import { format } from "date-fns"

export default async function MovementsReportPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePermissionPage('REPORT_VIEW')

  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 50
  
  const movements = await db.stockMovement.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { createdAt: 'desc' },
    include: {
      product: { include: { unit: true } },
      warehouse: true,
      location: true,
      performedBy: true
    }
  })

  const total = await db.stockMovement.count()
  const totalPages = Math.ceil(total / pageSize)

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'ENTRY': return { label: 'Entrada', color: 'success' }
      case 'EXIT': return { label: 'Saída', color: 'destructive' }
      case 'RETURN': return { label: 'Devolução', color: 'secondary' }
      case 'ADJUSTMENT_IN': return { label: 'Ajuste In', color: 'success' }
      case 'ADJUSTMENT_OUT': return { label: 'Ajuste Out', color: 'destructive' }
      case 'TRANSFER_IN': return { label: 'Transf In', color: 'outline' }
      case 'TRANSFER_OUT': return { label: 'Transf Out', color: 'outline' }
      default: return { label: type, color: 'secondary' }
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-emerald-600" />
            Extrato de Movimentações
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Histórico completo de transações em ordem cronológica.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {movements.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma movimentação registrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Origem/Destino</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Usuário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((mov) => {
                  const t = getTypeLabel(mov.type)
                  const isPositive = ['ENTRY', 'ADJUSTMENT_IN', 'TRANSFER_IN', 'RETURN'].includes(mov.type)
                  
                  return (
                    <TableRow key={mov.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {format(mov.createdAt, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.color as any} className="text-[10px] uppercase">
                          {t.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {mov.product.code} - {mov.product.name}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{mov.quantity}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{mov.warehouse.name}</TableCell>
                      <TableCell className="text-xs font-mono bg-muted">{mov.location.code}</TableCell>
                      <TableCell className="text-xs text-indigo-600 cursor-pointer hover:underline">
                        {mov.documentNumber || mov.referenceId || '-'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{mov.performedBy.name.split(' ')[0]}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <a href={`/reports/movements?page=${Math.max(1, page - 1)}`} className={`px-4 py-2 border rounded-md ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}>
            Anterior
          </a>
          <span className="px-4 py-2 text-muted-foreground">Página {page} de {totalPages}</span>
          <a href={`/reports/movements?page=${Math.min(totalPages, page + 1)}`} className={`px-4 py-2 border rounded-md ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}>
            Próxima
          </a>
        </div>
      )}
    </div>
  )
}
