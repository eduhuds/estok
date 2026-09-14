import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Edit } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"

export default async function UnitsPage() {
  const units = await db.productUnit.findMany({
    orderBy: { code: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Unidades de Medida</h2>
          <p className="text-muted-foreground">Gerencie as unidades (UN, KG, M, etc.) do sistema.</p>
        </div>
        <Link href="/units/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Unidade
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código ou nome..." className="pl-9" />
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
          {units.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Você ainda não possui unidades cadastradas.
            </div>
          ) : (
            units.map((unit) => (
              <div key={unit.id} className="p-4 space-y-3 bg-card hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">{unit.code}</span>
                    <span className="font-bold text-base text-foreground leading-tight">
                      {unit.name}
                    </span>
                  </div>
                  <Badge variant={unit.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-[10px]">
                    {unit.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {unit.description || '-'}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{unit._count.products}</span> produtos
                  </div>
                  <Link href={`/units/${unit.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                  </Link>
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
              <TableHead>Código / Sigla</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Qtd. Produtos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Você ainda não possui unidades cadastradas.
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium text-foreground">{unit.code}</TableCell>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.description || '-'}</TableCell>
                  <TableCell className="text-right">{unit._count.products}</TableCell>
                  <TableCell>
                    <Badge variant={unit.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {unit.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/units/${unit.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4 text-blue-600" />
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
    </div>
  )
}
