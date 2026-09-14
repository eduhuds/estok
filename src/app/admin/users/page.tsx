import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus } from "lucide-react"
import { db } from "@/lib/db"
import Link from "next/link"
import { UserActions } from "./user-actions"

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      roles: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">Gerencie o acesso da equipe à plataforma web e coletores mobile.</p>
        </div>
        <Link href="/admin/users/new">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95">
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm transition-all hover:border-primary/20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
          <Input placeholder="Buscar por nome ou e-mail..." className="pl-10 rounded-full border-border/50 bg-muted/50 focus-visible:ring-primary transition-all focus:bg-background" />
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-border/50">
          {users.map((user) => (
            <div key={user.id} className="p-4 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground leading-tight">{user.name}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
                  </div>
                </div>
                <Badge variant={user.status === 'ACTIVE' ? 'success' : (user.status === 'DELETED' ? 'destructive' : 'secondary')} className="text-[10px]">
                  {user.status === 'ACTIVE' ? 'Ativo' : (user.status === 'DELETED' ? 'Excluído' : 'Inativo')}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {user.roles.map(role => (
                  <Badge key={role.id} variant="outline" className="font-normal text-xs bg-muted/20">
                    {role.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <UserActions userId={user.id} userName={user.name} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <Badge key={role.id} variant="outline" className="font-normal text-xs bg-muted/20">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'ACTIVE' ? 'success' : (user.status === 'DELETED' ? 'destructive' : 'secondary')}>
                    {user.status === 'ACTIVE' ? 'Ativo' : (user.status === 'DELETED' ? 'Excluído' : 'Inativo')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UserActions userId={user.id} userName={user.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
