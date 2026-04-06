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
  LogIn,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"
import { NAV_ITEMS, NAV_ITEMS_AUTH } from "@/lib/constants"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3, Sparkles, Search, Flame, ScanLine, Star, CheckCircle, Bot, LogIn,
}

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 surface-low border-b border-border/30"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6edba6] to-[#30a373] flex items-center justify-center font-bold text-xs text-[#003822]">
            L
          </div>
          <span className="font-bold text-sm">LotoLogic</span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <span className="p-2 rounded-lg hover:bg-accent inline-flex">
              <Menu className="w-5 h-5" />
            </span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 surface-low border-l border-border/20 p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="flex items-center justify-between px-5 h-14 border-b border-border/20">
              <span className="font-bold text-sm">Menu</span>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="py-4 px-3 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2 block">
                Análise
              </span>
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {Icon && <Icon className="w-4.5 h-4.5" />}
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <div className="pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2 block">
                  {user ? "Minha Conta" : "Conta"}
                </span>
                {user ? (
                  NAV_ITEMS_AUTH.map((item) => {
                    const Icon = iconMap[item.icon]
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {Icon && <Icon className="w-4.5 h-4.5" />}
                        <span>{item.label}</span>
                      </Link>
                    )
                  })
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <LogIn className="w-4.5 h-4.5" />
                    <span>Entrar / Criar Conta</span>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Bottom nav mobile — acesso rápido */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around surface-low border-t border-border/20"
        style={{ backdropFilter: "blur(20px)" }}
      >
        {[
          { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
          { href: "/gerador", icon: Sparkles, label: "Gerador" },
          { href: "/concursos", icon: Search, label: "Concursos" },
          { href: "/heatmap", icon: Flame, label: "HeatMap" },
          { href: user ? "/meus-jogos" : "/login", icon: user ? Star : LogIn, label: user ? "Jogos" : "Entrar" },
        ].map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors min-w-[48px] min-h-[48px] justify-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
