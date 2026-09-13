import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, ArrowRightLeft, FileText, Smartphone, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import Link from "next/link"
import { DashboardCharts } from "./charts"

export default async function DashboardPage() {
  const totalProducts = await db.product.count()

  const pendingDivergencesCount = await db.inventoryDivergence.count({
    where: { status: 'PENDING' }
  })
  
  const pendingApprovalsCount = await db.inventoryDivergence.count({
    where: { status: 'REVIEWED' }
  })

  const inTransitTransfersCount = await db.stockTransfer.count({
    where: { status: 'IN_TRANSIT' } 
  })

  const activeInventories = await db.inventory.findMany({
    where: { status: 'IN_PROGRESS' },
    include: {
      _count: { select: { locations: true } },
      locations: { where: { status: 'COMPLETED' } }
    },
    take: 4
  })

  // Últimas movimentações
  const recentMovements = await db.stockMovement.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { product: true }
  })

  // Agrega entradas e saídas dos últimos 30 dias (simplificado para o gráfico)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentMovementsForChart = await db.stockMovement.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      type: { in: ['ENTRY', 'EXIT'] }
    },
    select: {
      type: true,
      quantity: true,
      createdAt: true
    }
  })

  // Prepara dados pro gráfico (agrupado por data de forma ingênua aqui no JS)
  const chartDataMap: Record<string, { name: string, entradas: number, saidas: number }> = {}
  
  recentMovementsForChart.forEach(m => {
    const d = new Date(m.createdAt)
    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`
    
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { name: dateStr, entradas: 0, saidas: 0 }
    }
    
    if (m.type === 'ENTRY') {
      chartDataMap[dateStr].entradas += m.quantity
    } else {
      chartDataMap[dateStr].saidas += m.quantity
    }
  })

  const chartData = Object.values(chartDataMap).slice(-7) // últimos 7 dias com mov.

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divergências (Para Revisão)</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDivergencesCount}</div>
            <p className="text-xs text-gray-500">Pendentes de análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ajustes (Aguardando Aprovação)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovalsCount}</div>
            <p className="text-xs text-gray-500">Revisados aguardando gestor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferências em Andamento</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitTransfersCount}</div>
            <p className="text-xs text-gray-500">Materiais em trânsito</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-gray-500">Cadastrados na base</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Entradas vs Saídas</CardTitle>
                <CardDescription>Fluxo de movimentações nos últimos dias de operação.</CardDescription>
              </div>
              <Link href="/reports/movements" className="text-sm text-indigo-600 hover:underline">
                Ver relatório
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pl-2 h-[300px]">
            <DashboardCharts data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Últimas Movimentações</CardTitle>
            <CardDescription>Entradas, saídas e ajustes recentes no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500 border border-dashed rounded-md">
                  Nenhuma movimentação.
                </div>
              ) : (
                recentMovements.map(mov => {
                  const isPositive = ['ENTRY', 'ADJUSTMENT_IN', 'TRANSFER_IN', 'RETURN'].includes(mov.type)
                  let typeStr = mov.type
                  if (mov.type === 'ENTRY') typeStr = 'Entrada'
                  if (mov.type === 'EXIT') typeStr = 'Saída'
                  if (mov.type === 'ADJUSTMENT_IN') typeStr = 'Ajuste (+)'
                  if (mov.type === 'ADJUSTMENT_OUT') typeStr = 'Ajuste (-)'
                  if (mov.type === 'TRANSFER_IN') typeStr = 'Transf. (+)'
                  if (mov.type === 'TRANSFER_OUT') typeStr = 'Transf. (-)'
                  if (mov.type === 'RETURN') typeStr = 'Devolução'

                  const Icon = mov.type === 'RETURN' ? RotateCcw : ArrowRightLeft

                  return (
                    <div key={mov.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{mov.product.name}</span>
                          <span className="text-xs text-gray-500">{typeStr} • {new Date(mov.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        isPositive ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {isPositive ? '+' : ''}{mov.quantity}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Inventários Ativos</CardTitle>
                <CardDescription>Acompanhe o progresso das contagens via Coletor.</CardDescription>
              </div>
              <Link href="/inventory" className="text-sm text-indigo-600 hover:underline">
                Ir para Inventários
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeInventories.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500 border border-dashed rounded-md">
                  Nenhum inventário em andamento no momento.
                </div>
              ) : (
                activeInventories.map(inv => {
                  const completed = inv.locations.length
                  const total = inv._count.locations
                  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

                  return (
                    <div key={inv.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex flex-col space-y-1">
                        <Link href={`/inventory/${inv.id}`} className="font-semibold hover:text-indigo-600">
                          {inv.name}
                        </Link>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Smartphone className="h-3 w-3" />
                          Locais: {completed}/{total}
                        </span>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="default">Em Andamento</Badge>
                        <span className="text-sm font-medium text-indigo-600">{progress}% concluído</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
