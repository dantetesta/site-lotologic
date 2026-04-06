"use client"

import { AppSidebar } from "@/components/shared/app-sidebar"
import { MobileNav } from "@/components/shared/mobile-nav"
import { LotterySelector } from "@/components/shared/lottery-selector"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <MobileNav />
      <main className="flex-1 min-w-0">
        {/* Header com seletor de loteria */}
        <header className="sticky top-0 z-30 h-14 lg:h-16 flex items-center px-4 lg:px-8 border-b border-border/20 surface-base mt-14 lg:mt-0"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <LotterySelector />
        </header>
        {/* Conteúdo da página */}
        <div className="p-4 lg:p-8 pb-20 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
