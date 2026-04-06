"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Sparkles,
  Search,
  Flame,
  ScanLine,
  Star,
  CheckCircle,
  Bot,
  Settings,
  LogIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"
import { NAV_ITEMS, NAV_ITEMS_AUTH } from "@/lib/constants"
import { useState } from "react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  Sparkles,
  Search,
  Flame,
  ScanLine,
  Star,
  CheckCircle,
  Bot,
  Settings,
  LogIn,
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
      style={{
        background: "rgba(20, 29, 32, 0.85)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(62, 73, 66, 0.1)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6edba6] to-[#30a373] flex items-center justify-center font-bold text-sm text-[#003822] flex-shrink-0">
          L
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm tracking-tight">
              LotoLogic
            </span>
            <span className="text-[10px] text-muted-foreground">
              Análise Inteligente
            </span>
          </div>
        )}
      </div>

      {/* Nav principal */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2 block">
          {!collapsed && "Análise"}
        </span>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary glow-green"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 flex-shrink-0",
                    isActive && "text-primary"
                  )}
                />
              )}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* Seção de usuário logado */}
        <div className="pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2 block">
            {!collapsed && (user ? "Minha Conta" : "Conta")}
          </span>
          {user ? (
            NAV_ITEMS_AUTH.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary glow-green"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {Icon && <Icon className="w-4.5 h-4.5 flex-shrink-0" />}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              <LogIn className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span>Entrar / Criar Conta</span>}
            </Link>
          )}
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  )
}
