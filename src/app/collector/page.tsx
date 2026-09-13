import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function CollectorHomePage() {
  // Simular que quem abriu foi o Almoxarife logado
  const userAlmox = await db.user.findFirst({ where: { role: { name: 'ALMOXARIFE' } } })
  const mockUserId = userAlmox?.id || ""

  // Como estamos testando, vamos buscar TODOS os inventários em andamento
  const activeInventories = await db.inventory.findMany({
    where: {
      status: 'IN_PROGRESS',
    },
    include: {
      locations: {
        where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
        include: { location: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans max-w-lg mx-auto">
      <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center gap-3">
        <Smartphone className="h-8 w-8" />
        <div>
          <h1 className="text-xl font-bold">KCollector Web</h1>
          <p className="text-indigo-200 text-sm">Bem-vindo(a) ao Coletor</p>
        </div>
      </div>

      <h2 className="text-gray-500 font-semibold mb-4 ml-1">Inventários Disponíveis</h2>

      {activeInventories.length === 0 ? (
        <Card className="border-none shadow-sm rounded-xl">
          <CardContent className="p-8 text-center text-gray-500">
            Nenhum inventário ativo atribuído a você no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeInventories.map(inv => (
            <Card key={inv.id} className="border-none shadow-sm rounded-xl overflow-hidden">
              <div className="bg-white p-4 border-b">
                <h3 className="font-bold text-lg text-gray-900">{inv.name}</h3>
                <p className="text-sm text-gray-500">{inv.code}</p>
              </div>
              <div className="bg-gray-50 p-2">
                <p className="text-xs font-semibold text-gray-500 px-2 pt-2 pb-1 uppercase tracking-wider">Locais Pendentes</p>
                {inv.locations.length === 0 ? (
                  <p className="text-sm p-2 text-gray-500">Nenhum local pendente.</p>
                ) : (
                  <div className="space-y-1 mt-1">
                    {inv.locations.map(l => (
                      <Link key={l.id} href={`/collector/${inv.id}/${l.locationId}`}>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer">
                          <span className="font-medium">{l.location.code}</span>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
