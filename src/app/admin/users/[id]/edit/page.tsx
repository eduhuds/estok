import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: { id: params.id },
    include: { roles: true }
  })

  if (!user) {
    redirect("/admin/users")
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Usuário</h2>
          <p className="text-muted-foreground">{user.name}</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Módulo em Construção</CardTitle>
          <CardDescription>
            A edição de usuários via painel administrativo está programada para a próxima etapa (Gerenciamento Avançado de Acessos).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A ativação e inativação rápida já está funcional direto pela tabela!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
