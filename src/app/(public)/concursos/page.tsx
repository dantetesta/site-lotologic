"use client"

import { useState } from "react"
import { useLotteryStore } from "@/stores/lottery-store"
import { LOTERIAS } from "@/lib/constants"
import { NumberOrb } from "@/components/shared/number-orb"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Trophy, ChevronLeft, ChevronRight } from "lucide-react"
import type { Resultado } from "@/types/lottery"

// Mock
function gerarMockResultados(loteria: string, count: number = 50): Resultado[] {
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
      premioAcumulado: Math.random() * 100000000,
      ganhadores: [
        { faixa: "Sena", ganhadores: Math.random() > 0.7 ? Math.ceil(Math.random() * 3) : 0, premio: Math.random() * 50000000 },
        { faixa: "Quina", ganhadores: Math.ceil(Math.random() * 100), premio: Math.random() * 50000 },
        { faixa: "Quadra", ganhadores: Math.ceil(Math.random() * 5000), premio: Math.random() * 1000 },
      ],
    }
  })
}

export default function ConcursosPage() {
  const { currentLottery } = useLotteryStore()
  const config = LOTERIAS[currentLottery]
  const [busca, setBusca] = useState("")
  const [resultados] = useState(() => gerarMockResultados(currentLottery))
  const [pagina, setPagina] = useState(0)
  const porPagina = 10

  const filtrados = busca
    ? resultados.filter(
        (r) =>
          String(r.concurso).includes(busca) ||
          r.data.includes(busca)
      )
    : resultados

  const paginados = filtrados.slice(pagina * porPagina, (pagina + 1) * porPagina)
  const totalPaginas = Math.ceil(filtrados.length / porPagina)

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <Search className="w-7 h-7 text-primary" />
          Concursos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consulte resultados da{" "}
          <span style={{ color: config.cor }} className="font-medium">
            {config.nomeExibicao}
          </span>
        </p>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por número do concurso ou data..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setPagina(0)
          }}
          className="pl-9 surface-high border-0 h-11"
        />
      </div>

      {/* Lista de concursos */}
      <div className="space-y-3">
        {paginados.map((r) => (
          <Card key={r.id} className="surface-low border-0">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Info */}
                <div className="flex-shrink-0 min-w-[140px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-lg font-bold text-primary">
                      #{r.concurso}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {r.data}
                  </span>
                  {r.premioAcumulado && r.premioAcumulado > 0 && (
                    <p className="text-xs text-secondary font-medium mt-1">
                      {formatMoney(r.premioAcumulado)}
                    </p>
                  )}
                </div>

                {/* Números */}
                <div className="flex flex-wrap gap-1.5">
                  {r.numeros.map((n, i) => (
                    <NumberOrb key={n} number={n} size="sm" delay={i} />
                  ))}
                </div>
              </div>

              {/* Ganhadores */}
              {r.ganhadores && r.ganhadores.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border/10">
                  {r.ganhadores.map((g) => (
                    <span
                      key={g.faixa}
                      className="text-[10px] text-muted-foreground"
                    >
                      <strong className="text-foreground">{g.faixa}:</strong>{" "}
                      {g.ganhadores} ganhador(es)
                      {g.premio > 0 && ` — ${formatMoney(g.premio)}`}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagina(Math.max(0, pagina - 1))}
            disabled={pagina === 0}
            className="p-2 rounded-lg hover:bg-accent disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground px-3">
            {pagina + 1} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(Math.min(totalPaginas - 1, pagina + 1))}
            disabled={pagina >= totalPaginas - 1}
            className="p-2 rounded-lg hover:bg-accent disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
