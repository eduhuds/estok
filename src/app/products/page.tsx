import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { ProductActions } from "./product-actions"

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: true,
      unit: true,
      defaultLocation: { include: { warehouse: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">Gerencie os produtos cadastrados no almoxarifado.</p>
        </div>
        <Link href="/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo produto
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código ou descrição..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-border">
          {products.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Você ainda não possui produtos cadastrados.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-4 space-y-3 bg-card hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">{product.code}</span>
                    <Link href={`/products/${product.id}`} className="font-bold text-base text-blue-600 leading-tight hover:underline">
                      {product.name}
                    </Link>
                  </div>
                  <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-[10px]">
                    {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Categoria</span>
                    <span className="font-medium text-foreground">{product.category.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Localização</span>
                    <span className="font-medium text-foreground">
                      {product.defaultLocation ? `${product.defaultLocation.warehouse.code}-${product.defaultLocation.code}` : '-'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">{product.unit.code}</span>
                  </div>
                  <ProductActions 
                    productId={product.id} 
                    productCode={product.code} 
                    productName={product.name} 
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Unid.</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  Você ainda não possui produtos cadastrados.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-foreground">{product.code}</TableCell>
                  <TableCell>
                    <Link href={`/products/${product.id}`} className="hover:underline text-blue-600 font-medium">
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.unit.code}</TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground italic">--</TableCell>
                  <TableCell>
                    {product.defaultLocation ? `${product.defaultLocation.warehouse.code}-${product.defaultLocation.code}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ProductActions 
                      productId={product.id} 
                      productCode={product.code} 
                      productName={product.name} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
