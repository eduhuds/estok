"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  MapPin, 
  ArrowRightLeft, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ClipboardList, 
  RotateCcw, 
  CheckSquare, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Shield, 
  Settings, 
  LogOut,
  FolderSync
} from "lucide-react"

const menuGroups = [
  {
    title: "Menu Inicial",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Estoque",
    items: [
      { name: "Produtos", href: "/products", icon: Package },
      { name: "Categorias", href: "#", icon: Tags },
      { name: "Localizações", href: "/locations", icon: MapPin },
      { name: "Movimentações", href: "#", icon: ArrowRightLeft },
    ]
  },
  {
    title: "Operações",
    items: [
      { name: "Entradas", href: "#", icon: ArrowDownToLine },
      { name: "Saídas", href: "#", icon: ArrowUpFromLine },
      { name: "Requisições", href: "#", icon: ClipboardList },
      { name: "Devoluções", href: "#", icon: RotateCcw },
    ]
  },
  {
    title: "Inventário (KCollector)",
    items: [
      { name: "Inventários", href: "/inventory", icon: ClipboardList },
      { name: "Coletor (Scanner)", href: "/collector", icon: CheckSquare },
      { name: "Conferências", href: "#", icon: CheckSquare },
      { name: "Divergências", href: "#", icon: AlertTriangle },
    ]
  },
  {
    title: "Importação/Exportação",
    items: [
      { name: "Importar", href: "/import", icon: FolderSync },
      { name: "Exportar", href: "/export", icon: FolderSync },
    ]
  },
  {
    title: "Sistema",
    items: [
      { name: "Relatórios", href: "/reports", icon: BarChart3 },
      { name: "API / Integração", href: "/api", icon: Settings },
    ]
  },
  {
    title: "Administração",
    items: [
      { name: "Central Admin", href: "/admin", icon: Shield },
      { name: "Usuários", href: "/admin/users", icon: Users },
      { name: "Configurações", href: "/admin/settings", icon: Settings },
    ]
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Sidebar({ user }: { user?: { name: string; email: string; role: string } | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Package className="h-6 w-6" />
          ESTOKA
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '#' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                          isActive 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4",
                          isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                        )} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Admin</span>
            <span className="text-xs text-gray-500">Administrador</span>
          </div>
        </div>
        <button className="mt-2 flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors">
          <LogOut className="h-4 w-4 text-gray-400" />
          Sair
        </button>
      </div>
    </aside>
  )
}
