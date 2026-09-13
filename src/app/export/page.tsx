import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

export default function ExportPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Exportar Dados</h2>
        <p className="text-gray-500">Exporte relatórios e cadastros para integração com outros sistemas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro de Produtos</CardTitle>
            <CardDescription>Catálogo completo com categorias, códigos e localizações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Excel
              </Button>
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <FileText className="h-4 w-4 text-gray-600" />
                CSV
              </Button>
            </div>
            <Button className="w-full flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Gerar Exportação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posição de Estoque</CardTitle>
            <CardDescription>Quantidades atuais, locais e valores aproximados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 flex-1 border-blue-200 bg-blue-50">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Excel
              </Button>
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <FileText className="h-4 w-4 text-red-600" />
                PDF
              </Button>
            </div>
            <Button className="w-full flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Gerar Exportação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Movimentações</CardTitle>
            <CardDescription>Todas as entradas, saídas e ajustes por período.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Excel
              </Button>
              <Button variant="outline" className="flex items-center gap-2 flex-1 border-blue-200 bg-blue-50">
                <FileText className="h-4 w-4 text-gray-600" />
                CSV
              </Button>
            </div>
            <Button className="w-full flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Gerar Exportação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados de Inventário</CardTitle>
            <CardDescription>Relatório final de contagens com divergências.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Excel
              </Button>
              <Button variant="outline" className="flex items-center gap-2 flex-1">
                <FileText className="h-4 w-4 text-red-600" />
                PDF
              </Button>
            </div>
            <Button className="w-full flex items-center justify-center gap-2" variant="secondary">
              Selecione o inventário...
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
