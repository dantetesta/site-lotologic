import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LotteryType, Resultado, StatsNumero } from "@/types/lottery"

interface LotteryState {
  // Loteria selecionada
  currentLottery: LotteryType
  setCurrentLottery: (lottery: LotteryType) => void

  // Resultados carregados (cache local)
  resultados: Record<string, Resultado[]>
  setResultados: (loteria: LotteryType, data: Resultado[]) => void

  // Filtro de período
  periodoFiltro: number // 0 = todos, 50, 100, 200, etc.
  setPeriodoFiltro: (periodo: number) => void

  // Loading states
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set) => ({
      currentLottery: "megasena",
      setCurrentLottery: (lottery) => set({ currentLottery: lottery }),

      resultados: {},
      setResultados: (loteria, data) =>
        set((state) => ({
          resultados: { ...state.resultados, [loteria]: data },
        })),

      periodoFiltro: 0,
      setPeriodoFiltro: (periodo) => set({ periodoFiltro: periodo }),

      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "lotologic-store",
      partialize: (state) => ({
        currentLottery: state.currentLottery,
        periodoFiltro: state.periodoFiltro,
      }),
    }
  )
)
