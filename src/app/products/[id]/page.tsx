import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Package, Archive } from "lucide-react"
import Link from "next/link"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      unit: true,
      defaultLocation: { include: { warehouse: true } },
      stocks: { include: { location: { include: { warehouse: true } } } },
      movements: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { location: true, performedBy: true }
      }
    }
  })

  if (!product) notFound()

  const totalQuantity = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
              <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>
                {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <p className="text-gray-500">{product.code} {product.barcode ? `• Cód. Barras: ${product.barcode}` : ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/stock/${product.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Ver Estoque
            </Button>
          </Link>
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar Produto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Categoria</p>
                <p className="font-medium">{product.category.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unidade de Medida</p>
                <p className="font-medium">{product.unit.name} ({product.unit.code})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Marca</p>
                <p className="font-medium">{product.brand || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modelo</p>
                <p className="font-medium">{product.model || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Localização Padrão</p>
                <p className="font-medium">{product.defaultLocation ? `${product.defaultLocation.warehouse.name} - ${product.defaultLocation.code}` : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estoque Mín / Máx</p>
                <p className="font-medium">{product.minimumStock} / {product.maximumStock > 0 ? product.maximumStock : 'Não definido'}</p>
              </div>
            </div>
            {product.notes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Observações</p>
                <p className="text-sm">{product.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg">Resumo de Estoque</CardTitle>
            <Package className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-4">{totalQuantity}</div>
            
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium">Localizações (Top 3)</h4>
              {product.stocks.length === 0 ? (
                <p className="text-sm text-gray-500">Sem estoque</p>
              ) : (
                product.stocks.slice(0, 3).map(stock => (
                  <div key={stock.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{stock.location.code}</span>
                    <span className="font-medium">{stock.quantity}</span>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3 pt-4 border-t mt-4">
              <h4 className="text-sm font-medium">Últimas Movimentações</h4>
              {product.movements.length === 0 ? (
                <p className="text-sm text-gray-500">Sem movimentações</p>
              ) : (
                product.movements.slice(0, 3).map(mov => (
                  <div key={mov.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate max-w-[120px]" title={mov.type}>
                      {mov.type === 'ENTRY' ? 'Entrada' : mov.type === 'EXIT' ? 'Saída' : mov.type}
                    </span>
                    <span className={`font-medium ${mov.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
