import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, FileType, CheckCircle2 } from "lucide-react"

export default function ImportPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Importar Dados</h2>
        <p className="text-gray-500">Importe planilhas e arquivos do sistema legado ou KCollector antigo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50/50 cursor-pointer hover:border-blue-400 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FileType className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Produtos</p>
              <p className="text-xs text-gray-500">Cadastro base</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-blue-600 ml-auto opacity-100" />
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-gray-300 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
              <FileType className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Estoque</p>
              <p className="text-xs text-gray-500">Quantidades</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-gray-300 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
              <FileType className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Inventários</p>
              <p className="text-xs text-gray-500">Histórico</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl m-4 bg-gray-50/50">
          <div className="h-16 w-16 bg-white border shadow-sm rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Arraste seu arquivo para cá</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Suportamos arquivos .csv, .xls e .xlsx. O assistente ajudará no mapeamento das colunas no próximo passo.
          </p>
          <Button>Selecionar arquivo do computador</Button>
        </CardContent>
      </Card>
    </div>
  )
}
