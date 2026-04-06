"use client"

import { useLotteryStore } from "@/stores/lottery-store"
import { LOTERIAS_LISTA } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function LotterySelector() {
  const { currentLottery, setCurrentLottery } = useLotteryStore()

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {LOTERIAS_LISTA.map((lot) => (
        <button
          key={lot.id}
          onClick={() => setCurrentLottery(lot.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
            currentLottery === lot.id
              ? "text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground surface-high hover:bg-[#3a4548]"
          )}
          style={
            currentLottery === lot.id
              ? { background: lot.cor, boxShadow: `0 4px 12px ${lot.cor}40` }
              : undefined
          }
        >
          <span>{lot.icon}</span>
          <span className="hidden sm:inline">{lot.nomeExibicao}</span>
        </button>
      ))}
    </div>
  )
}
