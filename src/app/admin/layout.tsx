"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/anuncios", label: "Anúncios", icon: Megaphone },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/admin/config", label: "Configurações", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Admin */}
      <aside className="w-[240px] flex-shrink-0 surface-low border-r border-border/20 hidden lg:flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border/20">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#e9c349] to-[#d4a017] flex items-center justify-center text-[10px] font-bold text-[#3d2e00]">
            A
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Site
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all w-full">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        {/* Top bar mobile */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-8 border-b border-border/20 surface-base">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#e9c349] to-[#d4a017] flex items-center justify-center text-[10px] font-bold text-[#3d2e00]">
              A
            </div>
            <span className="font-bold text-sm">Admin</span>
          </div>
          <div className="text-xs text-muted-foreground">
            LotoLogic Admin Panel
          </div>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
