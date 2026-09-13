import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { createProductAction } from "../actions"

export default async function NewProductPage() {
  const categories = await db.productCategory.findMany()
  const units = await db.productUnit.findMany()
  const locations = await db.warehouseLocation.findMany({ include: { warehouse: true } })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Novo Produto</h2>
          <p className="text-gray-500">Adicione um novo produto ao catálogo do almoxarifado.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <form action={createProductAction} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código Interno</label>
                  <Input name="code" placeholder="Ex: MAT-001" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código de Barras</label>
                  <Input name="barcode" placeholder="EAN-13, EAN-8..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Descrição Completa</label>
                  <Input name="name" placeholder="Descrição detalhada do produto" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição Curta</label>
                  <Input name="shortDescription" placeholder="Nome reduzido" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select name="categoryId" required>
                    <option value="">Selecione...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Controle e Estoque</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unidade de Medida</label>
                  <Select name="unitId" required>
                    <option value="">Selecione...</option>
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.code} - {u.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estoque Mínimo</label>
                  <Input name="minimumStock" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estoque Máximo</label>
                  <Input name="maximumStock" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <Input name="brand" placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input name="model" placeholder="Opcional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Localização Padrão</label>
                  <Select name="defaultLocationId">
                    <option value="">Selecione...</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.warehouse.code} - {l.code}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/products">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Produto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
