import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Edit } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"

export default async function LocationsPage() {
  const locations = await db.warehouseLocation.findMany({
    orderBy: [{ warehouseId: 'asc' }, { code: 'asc' }],
    include: {
      warehouse: true,
      parent: true,
      _count: {
        select: { products: true, stocks: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Localizações</h2>
          <p className="text-muted-foreground">Mapeie os corredores, estantes e prateleiras dos almoxarifados.</p>
        </div>
        <Link href="/locations/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Localização
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por código, nome ou almoxarifado..." className="pl-9" />
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
          {locations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Você ainda não possui localizações cadastradas.
            </div>
          ) : (
            locations.map((location) => (
              <div key={location.id} className="p-4 space-y-3 bg-card hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">{location.warehouse.code}</span>
                    <span className="font-bold text-base text-foreground leading-tight">
                      {location.code} - {location.name}
                    </span>
                  </div>
                  <Badge variant={location.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-[10px]">
                    {location.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Pai:</span> {location.parent ? `${location.parent.code} - ${location.parent.name}` : '-'}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{location._count.stocks}</span> itens em estoque
                  </div>
                  <Link href={`/locations/${location.id}/edit`}>
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
              <TableHead>Almoxarifado</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Localização Pai</TableHead>
              <TableHead className="text-right">Produtos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Você ainda não possui localizações cadastradas.
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium text-foreground">{location.warehouse.code}</TableCell>
                  <TableCell className="font-medium">{location.code}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {location.parent ? `${location.parent.code} - ${location.parent.name}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">{location._count.stocks}</TableCell>
                  <TableCell>
                    <Badge variant={location.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {location.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/locations/${location.id}/edit`}>
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
