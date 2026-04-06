"use client"

import { useEffect, useState, useMemo } from "react"
import { useLotteryStore } from "@/stores/lottery-store"
import { LOTERIAS } from "@/lib/constants"
import { calcularFrequencias } from "@/lib/lottery-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import type { Resultado, StatsNumero } from "@/types/lottery"

function gerarMockResultados(loteria: string, count: number = 300): Resultado[] {
  const config = LOTERIAS[loteria as keyof typeof LOTERIAS]
  if (!config) return []
  const start = loteria === "lotomania" ? 0 : 1
  const end = loteria === "lotomania" ? config.poolSize - 1 : config.poolSize

  return Array.from({ length: count }, (_, i) => {
    const nums: number[] = []
    while (nums.length < config.pickCount) {
      const n = Math.floor(Math.random() * (end - start + 1)) + start
      if (!nums.includes(n)) nums.push(n)
    }
    return {
      id: i + 1,
      loteria: config.id,
      concurso: 2800 - i,
      data: new Date(Date.now() - i * 3.5 * 86400000).toISOString().split("T")[0],
      numeros: nums.sort((a, b) => a - b),
    }
  })
}

export default function HeatmapPage() {
  const { currentLottery, periodoFiltro } = useLotteryStore()
  const config = LOTERIAS[currentLottery]
  const [stats, setStats] = useState<StatsNumero[]>([])

  useEffect(() => {
    const data = gerarMockResultados(currentLottery, 500)
    const freq = calcularFrequencias(data, currentLottery, periodoFiltro || undefined)
    setStats(freq)
  }, [currentLottery, periodoFiltro])

  const { minFreq, maxFreq, columns } = useMemo(() => {
    if (stats.length === 0) return { minFreq: 0, maxFreq: 1, columns: 10 }
    const freqs = stats.map((s) => s.frequencia)
    // Colunas do volante (layout real da lotérica)
    let cols = 10
    if (currentLottery === "lotofacil") cols = 5
    else if (currentLottery === "quina" || currentLottery === "timemania") cols = 10
    else if (currentLottery === "lotomania") cols = 10
    else if (currentLottery === "supersete") cols = 10
    return {
      minFreq: Math.min(...freqs),
      maxFreq: Math.max(...freqs),
      columns: cols,
    }
  }, [stats, currentLottery])

  const getColor = (freq: number): string => {
    const ratio = maxFreq > minFreq ? (freq - minFreq) / (maxFreq - minFreq) : 0.5
    if (ratio > 0.75) return "#6edba6" // quente
    if (ratio > 0.5) return "#a8cf45"  // morno-quente
    if (ratio > 0.25) return "#e9c349" // morno
    return "#2d3639" // frio
  }

  const getOpacity = (freq: number): number => {
    const ratio = maxFreq > minFreq ? (freq - minFreq) / (maxFreq - minFreq) : 0.5
    return 0.4 + ratio * 0.6
  }

  const pool = currentLottery === "lotomania"
    ? Array.from({ length: config.poolSize }, (_, i) => i)
    : Array.from({ length: config.poolSize }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <Flame className="w-7 h-7 text-secondary" />
          Mapa de Calor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize os números quentes e frios no formato do volante —{" "}
          <span style={{ color: config.cor }} className="font-medium">
            {config.nomeExibicao}
          </span>
        </p>
      </div>

      {/* Filtro de período */}
      <div className="flex items-center gap-1.5">
        {[0, 50, 100, 200, 500].map((p) => (
          <button
            key={p}
            onClick={() => useLotteryStore.getState().setPeriodoFiltro(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              periodoFiltro === p
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {p === 0 ? "Todos" : `Últimos ${p}`}
          </button>
        ))}
      </div>

      {/* Volante */}
      <Card className="surface-low border-0">
        <CardContent className="pt-6">
          <div
            className="grid gap-2 max-w-2xl mx-auto"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {pool.map((num) => {
              const stat = stats.find((s) => s.numero === num)
              const freq = stat?.frequencia ?? 0
              const color = getColor(freq)
              const opacity = getOpacity(freq)

              return (
                <div
                  key={num}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-110 cursor-default group relative"
                  style={{
                    background: color,
                    opacity,
                    boxShadow: freq > (maxFreq * 0.7) ? `0 0 12px ${color}40` : "none",
                  }}
                >
                  <span className="font-bold text-xs sm:text-sm text-white drop-shadow">
                    {String(num).padStart(2, "0")}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-white/70">
                    {freq}x
                  </span>

                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0c1518] text-foreground px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-ambient">
                    Nº {String(num).padStart(2, "0")} — {freq}x ({stat?.percentual.toFixed(1)}%)
                    {stat && stat.atraso <= 3 && " 🔥"}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: "#2d3639" }} />
              Frio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: "#e9c349" }} />
              Morno
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: "#a8cf45" }} />
              Quente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: "#6edba6" }} />
              Muito Quente
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
