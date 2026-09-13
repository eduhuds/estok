import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import DivergenceForm from "./divergence-form"

export default async function DivergenceDetailsPage({ params }: { params: { id: string, divergenceId: string } }) {
  const { id, divergenceId } = await params
  
  const div = await db.inventoryDivergence.findUnique({
    where: { id: divergenceId },
    include: {
      inventory: true,
      product: true,
      location: true,
      reviewedBy: true,
      approvedBy: true,
      rejectedBy: true
    }
  })

  if (!div || div.inventoryId !== id) notFound()

  // Buscar usuário Gestor para simular quem está aprovando
  const userGestor = await db.user.findFirst({ where: { role: { name: 'GESTOR' } } })
  const mockUserId = userGestor?.id || ""

  const diffColor = div.difference > 0 ? 'text-emerald-600' : 'text-red-600'
  const diffSignal = div.difference > 0 ? '+' : ''
  const percentDiff = div.systemQuantity > 0 
    ? Math.round((Math.abs(div.difference) / div.systemQuantity) * 100) 
    : 100

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/inventory/${id}/divergences`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Análise de Divergência</h2>
            <Badge variant="outline" className="uppercase">{div.status}</Badge>
          </div>
          <p className="text-gray-500">
            Inventário: {div.inventory.code} • Local: {div.location.code}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Contagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Produto</p>
                  <p className="font-bold text-lg">{div.product.code}</p>
                  <p className="text-sm">{div.product.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg border">
                  <p className="text-sm text-gray-500 mb-1">Sistema Esperava</p>
                  <p className="text-3xl font-bold text-gray-400">{div.systemQuantity}</p>
                </div>
                <div className="flex items-center justify-center text-gray-300">
                  <ArrowRight className="h-8 w-8" />
                </div>
                <div className="p-4 bg-white rounded-lg border shadow-sm border-indigo-100">
                  <p className="text-sm text-indigo-600 font-medium mb-1">Total Contado</p>
                  <p className="text-3xl font-bold text-gray-900">{div.countedQuantity}</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-900 text-white rounded-lg">
                <span className="font-medium text-lg">Diferença Encontrada</span>
                <div className="text-right">
                  <span className={`text-3xl font-bold ${diffColor}`}>{diffSignal}{div.difference}</span>
                  <span className="text-gray-400 text-sm ml-2">({percentDiff}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-gray-900">Divergência Registrada</div>
                      <time className="font-mono text-xs text-gray-500">{new Date(div.createdAt).toLocaleDateString()}</time>
                    </div>
                    <div className="text-sm text-gray-500">Registrado automaticamente pelo sistema ao encerrar as coletas do inventário.</div>
                  </div>
                </div>

                {div.reviewedBy && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-900">Revisado</div>
                        <time className="font-mono text-xs text-gray-500">{div.reviewedAt && new Date(div.reviewedAt).toLocaleDateString()}</time>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Por: {div.reviewedBy.name}</div>
                      {div.reviewNotes && <div className="text-sm bg-gray-50 p-2 rounded border">{div.reviewNotes}</div>}
                    </div>
                  </div>
                )}

                {div.approvedBy && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-900">Aprovado e Ajustado</div>
                        <time className="font-mono text-xs text-gray-500">{div.approvedAt && new Date(div.approvedAt).toLocaleDateString()}</time>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Por: {div.approvedBy.name}</div>
                      {div.approvalNotes && <div className="text-sm bg-gray-50 p-2 rounded border">{div.approvalNotes}</div>}
                    </div>
                  </div>
                )}

                {div.rejectedBy && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-red-100 text-red-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-900">Rejeitado</div>
                        <time className="font-mono text-xs text-gray-500">{div.rejectedAt && new Date(div.rejectedAt).toLocaleDateString()}</time>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Por: {div.rejectedBy.name}</div>
                      {div.rejectionReason && <div className="text-sm bg-gray-50 p-2 rounded border">{div.rejectionReason}</div>}
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <DivergenceForm 
            divergenceId={div.id}
            inventoryId={div.inventoryId}
            userId={mockUserId}
            status={div.status}
          />
        </div>
      </div>
    </div>
  )
}
