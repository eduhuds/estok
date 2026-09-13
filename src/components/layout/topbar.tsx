"use client"
import { Bell, Menu, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { logoutAction } from "@/app/auth-actions"

export function Topbar({ user }: { user?: { name: string; email: string; role: string } | null }) {
  const pathname = usePathname()
  
  // A simple way to get page title from pathname
  const pageTitle = pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'
  const titleFormatted = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {titleFormatted}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Busca global..." 
            className="h-9 w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <Link href="/notifications" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-md">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </Link>
        {user && (
          <div className="flex items-center gap-3 ml-2 border-l pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
              <p className="text-xs text-gray-500 mt-1">{user.role}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <button 
              onClick={() => logoutAction()}
              className="text-xs text-red-600 hover:text-red-700 hover:underline ml-2"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
