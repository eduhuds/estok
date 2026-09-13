import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { getSession } from "@/lib/auth"

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <div className="hidden lg:block">
        <Sidebar user={session} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={session} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
