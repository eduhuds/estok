import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Box } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"

export default async function StockPage() {
  // O Prisma não suporta GroupBy com includes aninhados perfeitamente num nível único,
  // então vamos buscar todos os produtos e somar seus estoques.
  const products = await db.product.findMany({
    include: {
      category: true,
      unit: true,
      stocks: {
        include: { location: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  // Agrupando visualmente os dados para exibir
  const stockData = products.map(p => {
    const totalQuantity = p.stocks.reduce((acc, stock) => acc + stock.quantity, 0)
    const totalReserved = p.stocks.reduce((acc, stock) => acc + stock.reservedQuantity, 0)
    const available = totalQuantity - totalReserved

    let status = 'NORMAL'
    let statusLabel = 'Normal'
    let variant = 'success'

    if (totalQuantity <= p.minimumStock && p.minimumStock > 0) {
      status = 'LOW'
      statusLabel = 'Baixo'
      variant = 'warning'
    } else if (totalQuantity >= p.maximumStock && p.maximumStock > 0) {
      status = 'HIGH'
      statusLabel = 'Excesso'
      variant = 'default'
    }

    if (totalQuantity === 0) {
      status = 'EMPTY'
      statusLabel = 'Zerado'
      variant = 'secondary'
    }

    return {
      product: p,
      totalQuantity,
      totalReserved,
      available,
      status,
      statusLabel,
      variant
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque e Saldos</h2>
          <p className="text-muted-foreground">Acompanhe a disponibilidade física dos materiais no almoxarifado.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código ou produto..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Físico</TableHead>
              <TableHead className="text-right">Reservado</TableHead>
              <TableHead className="text-right">Disponível</TableHead>
              <TableHead>Min/Máx</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              stockData.map((data) => (
                <TableRow key={data.product.id}>
                  <TableCell className="font-medium text-foreground">{data.product.code}</TableCell>
                  <TableCell>
                    <Link href={`/stock/${data.product.id}`} className="hover:underline text-blue-600 font-medium">
                      {data.product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{data.product.category.name}</TableCell>
                  <TableCell className="text-right font-medium">{data.totalQuantity} <span className="text-xs text-muted-foreground font-normal">{data.product.unit.code}</span></TableCell>
                  <TableCell className="text-right text-muted-foreground">{data.totalReserved}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{data.available}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {data.product.minimumStock} / {data.product.maximumStock > 0 ? data.product.maximumStock : '∞'}
                  </TableCell>
                  <TableCell>
                    {/* @ts-expect-error: variant string literal mismatch */}
                    <Badge variant={data.variant}>{data.statusLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/stock/${data.product.id}`}>
                      <Button variant="ghost" size="icon" title="Ver Distribuição">
                        <Box className="h-4 w-4 text-blue-600" />
                      </Button>
                    </Link>
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
