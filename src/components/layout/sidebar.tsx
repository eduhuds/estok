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
  FolderSync,
  HelpCircle
} from "lucide-react"

const menuGroups = [
  {
    title: "Menu Inicial",
    items: [
      { name: "Painel Geral", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Estoque",
    items: [
      { name: "Produtos", href: "/products", icon: Package },
      { name: "Categorias", href: "/categories", icon: Tags },
      { name: "Unidades", href: "/units", icon: Package },
      { name: "Localizações", href: "/locations", icon: MapPin },
      { name: "Movimentações", href: "/movements", icon: ArrowRightLeft },
    ]
  },
  {
    title: "Operações",
    items: [
      { name: "Entradas", href: "/receipts", icon: ArrowDownToLine },
      { name: "Saídas", href: "/issues", icon: ArrowUpFromLine },
      { name: "Requisições", href: "/requests", icon: ClipboardList },
      { name: "Devoluções", href: "/returns", icon: RotateCcw },
    ]
  },
  {
    title: "Inventário",
    items: [
      { name: "Auditorias", href: "/inventory", icon: ClipboardList },
      { name: "Coletor (Scanner)", href: "/collector", icon: CheckSquare },
    ]
  },
  {
    title: "Integração",
    items: [
      { name: "Importar", href: "/import", icon: FolderSync },
      { name: "Exportar", href: "/export", icon: FolderSync },
    ]
  },
  {
    title: "Sistema",
    items: [
      { name: "Relatórios", href: "/reports", icon: BarChart3 },
      { name: "API / Conectores", href: "/api", icon: Settings },
      { name: "Central de Ajuda", href: "/help", icon: HelpCircle },
    ]
  },
  {
    title: "Administração",
    items: [
      { name: "Gestão Central", href: "/admin", icon: Shield },
      { name: "Usuários", href: "/admin/users", icon: Users },
      { name: "Configurações", href: "/admin/settings", icon: Settings },
    ]
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Sidebar({ user }: { user?: { name: string; email: string; roles: string[] } | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-full flex-col border-r border-border/50 bg-gradient-to-br from-indigo-100 via-slate-50 to-blue-100 dark:from-slate-950 dark:via-indigo-950/90 dark:to-slate-950 shadow-xl backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-border/50 px-6 shrink-0">
        <div className="flex items-center gap-2 font-black text-xl text-primary tracking-tight">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
            <Package className="h-5 w-5" />
          </div>
          ESTOK
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-8 px-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 px-2 text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/dashboard' && item.href !== '/admin' && item.href !== '#' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-4 rounded-xl px-3 py-3 md:py-2 text-base md:text-sm font-medium transition-all duration-200 ease-in-out",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 md:h-4 md:w-4 transition-transform duration-200 shrink-0",
                          isActive ? "text-primary-foreground" : "group-hover:scale-110"
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

      <div className="border-t border-border/50 p-4 bg-transparent shrink-0">
        <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/50 cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-base md:text-sm font-bold text-foreground leading-none truncate">{user?.name || 'Usuário'}</span>
            <span className="text-sm md:text-xs text-muted-foreground mt-1 truncate">{user?.roles?.join(', ') || 'Sem perfil'}</span>
          </div>
        </div>
        <button className="mt-2 flex w-full items-center justify-center md:justify-start gap-3 rounded-xl px-3 py-3 md:py-2 text-base md:text-sm font-bold md:font-medium text-destructive md:text-muted-foreground hover:bg-destructive/10 md:hover:text-destructive transition-all duration-200">
          <LogOut className="h-5 w-5 md:h-4 md:w-4" />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  )
}
