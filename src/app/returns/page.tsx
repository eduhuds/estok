import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Plus } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ReturnsPage() {
  const returns = await db.materialReturn.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      warehouse: true,
      request: true,
      returnedBy: true,
      _count: { select: { items: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Devoluções</h2>
            <p className="text-gray-500">Controle de materiais devolvidos ao estoque.</p>
          </div>
        </div>
        <Link href="/returns/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Devolução
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Almoxarifado</TableHead>
              <TableHead>Devolvido Por</TableHead>
              <TableHead>Req. Original</TableHead>
              <TableHead className="text-center">Itens</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  <RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  Nenhuma devolução registrada.
                </TableCell>
              </TableRow>
            ) : (
              returns.map(ret => (
                <TableRow key={ret.id}>
                  <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                  <TableCell>{ret.warehouse.name}</TableCell>
                  <TableCell>{ret.returnedBy.name}</TableCell>
                  <TableCell>
                    {ret.request ? (
                      <Link href={`/requests/${ret.requestId}`} className="text-indigo-600 hover:underline">
                        {ret.request.requestNumber}
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{ret._count.items}</TableCell>
                  <TableCell>{new Date(ret.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {ret.status === 'DRAFT' && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Rascunho</Badge>}
                    {ret.status === 'RECEIVED' && <Badge variant="success">Recebido</Badge>}
                    {ret.status === 'CANCELLED' && <Badge variant="destructive">Cancelado</Badge>}
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
