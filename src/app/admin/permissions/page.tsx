import { requirePermissionPage } from "@/lib/permissions"
import { db } from "@/lib/db"
import { ShieldCheck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

export default async function PermissionsPage() {
  await requirePermissionPage('CONFIG_MANAGE')

  const roles = await db.role.findMany({
    orderBy: { name: 'asc' },
    include: { permissions: true }
  })
  
  const permissions = await db.permission.findMany({
    orderBy: { key: 'asc' }
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            Matriz de Permissões
          </h1>
          <p className="text-gray-500 text-sm mt-1">Controle de acesso granular por papel (Role-Based Access Control).</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[300px]">Permissão</TableHead>
                {roles.map(role => (
                  <TableHead key={role.id} className="text-center font-bold">{role.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map(permission => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <p className="font-semibold text-gray-900">{permission.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{permission.key}</p>
                  </TableCell>
                  {roles.map(role => {
                    const hasPerm = role.permissions.some(rp => rp.permissionId === permission.id)
                    const isAdmin = role.name === 'ADMIN'
                    return (
                      <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                        <Switch 
                          checked={isAdmin || hasPerm} 
                          disabled={isAdmin} // Admin sempre tem tudo
                          aria-label={`Permissão ${permission.key} para ${role.name}`}
                        />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
