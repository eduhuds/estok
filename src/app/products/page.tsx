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

      <div className="flex flex-col sm:flex-row gap-4 bg-card/95 backdrop-blur-xl p-4 rounded-2xl border border-border/40 shadow-sm">
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

      <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl shadow-indigo-500/5 overflow-hidden transition-all duration-200">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-border/50">
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">Nenhum produto</p>
              <p className="text-sm text-muted-foreground">Você ainda não possui produtos cadastrados.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-5 space-y-4 bg-transparent hover:bg-muted/20 transition-colors">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm uppercase">
                      {product.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Link href={`/products/${product.id}`} className="font-semibold text-base text-foreground leading-tight hover:text-primary transition-colors">
                          {product.name}
                        </Link>
                      </div>
                      <span className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        Cod: {product.code}
                      </span>
                    </div>
                  </div>
                  {product.status === 'ACTIVE' ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-medium whitespace-nowrap">
                      <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse"></span>
                      Ativo
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-600 border border-zinc-500/20 text-[10px] font-medium whitespace-nowrap">
                      <span className="h-1 w-1 rounded-full bg-zinc-600"></span>
                      Inativo
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm p-3 bg-muted/30 rounded-lg border border-border/30">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">Categoria</span>
                    <span className="font-medium text-foreground">{product.category.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">Localização</span>
                    <span className="font-medium text-foreground">
                      {product.defaultLocation ? `${product.defaultLocation.warehouse.code}-${product.defaultLocation.code}` : '-'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-secondary/60 text-foreground px-2 py-1 rounded-md border border-border/50">{product.unit.code}</span>
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
        <div className="hidden md:block overflow-x-auto p-1">
          <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Código</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Produto</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Categoria</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-center">Unid.</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Estoque</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Localização</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Status</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-muted/50 p-4">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
                    <p className="text-sm text-muted-foreground">Você ainda não possui produtos cadastrados no sistema.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow 
                  key={product.id}
                  className="group border-b border-border/40 hover:bg-primary/[0.02] transition-all duration-300 ease-in-out"
                >
                  <TableCell className="px-6 py-4 font-mono text-sm text-muted-foreground">{product.code}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 uppercase text-sm">
                        {product.name.charAt(0)}
                      </div>
                      <Link href={`/products/${product.id}`} className="font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/30 text-sm">
                      {product.category.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/50 uppercase">
                      {product.unit.code}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="font-semibold text-muted-foreground/60">--</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {product.defaultLocation ? `${product.defaultLocation.warehouse.code}-${product.defaultLocation.code}` : '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {product.status === 'ACTIVE' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-[pulse_2s_ease-in-out_infinite]"></span>
                        Ativo
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-600 border border-zinc-500/20 text-sm font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
                        Inativo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <ProductActions 
                        productId={product.id} 
                        productCode={product.code} 
                        productName={product.name} 
                      />
                    </div>
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
