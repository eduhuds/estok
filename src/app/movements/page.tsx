import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { db } from "@/lib/db"

export default async function MovementsPage() {
  const movements = await db.stockMovement.findMany({
    include: {
      product: { include: { unit: true } },
      location: { include: { warehouse: true } },
      performedBy: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Histórico de Movimentações</h2>
          <p className="text-gray-500">Registro global e imutável de todas as alterações de estoque.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Buscar por produto, usuário ou documento..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Qtd</TableHead>
              <TableHead>Local / Origem</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  Nenhuma movimentação registrada.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((mov) => {
                const isPositive = ['ENTRY', 'ADJUSTMENT_IN', 'TRANSFER_IN', 'RETURN'].includes(mov.type)
                
                let badgeVariant = 'secondary'
                let typeLabel = mov.type
                
                if (mov.type === 'ENTRY') { badgeVariant = 'success'; typeLabel = 'Entrada' }
                if (mov.type === 'EXIT') { badgeVariant = 'destructive'; typeLabel = 'Saída' }
                if (mov.type === 'ADJUSTMENT_IN') { badgeVariant = 'outline'; typeLabel = 'Ajuste (+)' }
                if (mov.type === 'ADJUSTMENT_OUT') { badgeVariant = 'outline'; typeLabel = 'Ajuste (-)' }
                if (mov.type === 'TRANSFER_IN') { badgeVariant = 'secondary'; typeLabel = 'Transf. (+)' }
                if (mov.type === 'TRANSFER_OUT') { badgeVariant = 'secondary'; typeLabel = 'Transf. (-)' }
                if (mov.type === 'RETURN') { badgeVariant = 'default'; typeLabel = 'Devolução' }
                
                return (
                  <TableRow key={mov.id}>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {new Date(mov.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="text-gray-900">{mov.product.name}</div>
                      <div className="text-xs text-gray-500 font-normal">{mov.product.code}</div>
                    </TableCell>
                    <TableCell>
                      {/* @ts-expect-error: variant string literal mismatch */}
                      <Badge variant={badgeVariant} className="text-[10px] px-2 py-0.5">
                        {typeLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{mov.quantity} <span className="text-xs font-normal opacity-70">{mov.product.unit.code}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{mov.location.code}</div>
                      <div className="text-xs text-gray-500">{mov.location.warehouse.name}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {mov.documentNumber || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {mov.performedBy.name.split(' ')[0]}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
