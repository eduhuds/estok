import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"

export default async function ReceiptsPage() {
  const receipts = await db.stockReceipt.findMany({
    include: {
      supplier: true,
      warehouse: true,
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Entradas de Materiais</h2>
          <p className="text-gray-500">Acompanhe e registre o recebimento de mercadorias no estoque.</p>
        </div>
        <Link href="/receipts/new">
          <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Nova Entrada
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Buscar por número do documento ou fornecedor..." className="pl-9" />
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
              <TableHead>Número</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Almoxarifado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-center">Itens</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                  Nenhuma entrada registrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium text-gray-900">{receipt.documentNumber || 'Sem Num.'}</TableCell>
                  <TableCell>{receipt.supplier.name}</TableCell>
                  <TableCell className="text-gray-500">{receipt.warehouse.name}</TableCell>
                  <TableCell>
                    {receipt.documentDate ? new Date(receipt.documentDate).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell className="text-center">{receipt._count.items}</TableCell>
                  <TableCell className="text-right font-medium">
                    {receipt.total ? `R$ ${Number(receipt.total).toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={receipt.status === 'COMPLETED' ? 'success' : receipt.status === 'DRAFT' ? 'outline' : 'secondary'}>
                      {receipt.status === 'COMPLETED' ? 'Concluída' : receipt.status === 'DRAFT' ? 'Rascunho' : 'Cancelada'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
