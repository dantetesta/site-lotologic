"use client"

import { useState } from "react"
import { useLotteryStore } from "@/stores/lottery-store"
import { LOTERIAS } from "@/lib/constants"
import { analisarJogo } from "@/lib/lottery-engine"
import { NumberOrb } from "@/components/shared/number-orb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ScanLine, ArrowRight, Gauge, BarChart3 } from "lucide-react"
import type { AnaliseJogo } from "@/lib/lottery-engine"

export default function RaioXPage() {
  const { currentLottery } = useLotteryStore()
  const config = LOTERIAS[currentLottery]
  const [inputNums, setInputNums] = useState("")
  const [analise, setAnalise] = useState<AnaliseJogo | null>(null)

  const analisar = () => {
    const nums = inputNums
      .split(/[\s,\-;]+/)
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n >= (currentLottery === "lotomania" ? 0 : 1) && n <= config.poolSize)
      .filter((v, i, a) => a.indexOf(v) === i) // unique

    if (nums.length < config.pickCount) {
      return
    }

    const result = analisarJogo(nums.slice(0, config.pickCount), currentLottery, [])
    setAnalise(result)
  }

  const scoreColor = (score: number) => {
    if (score >= 70) return "#6edba6"
    if (score >= 40) return "#e9c349"
    return "#ffb4ab"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <ScanLine className="w-7 h-7 text-primary" />
          Raio-X do Jogo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análise profunda do seu jogo —{" "}
          <span style={{ color: config.cor }} className="font-medium">
            {config.nomeExibicao}
          </span>
        </p>
      </div>

      {/* Input */}
      <Card className="surface-low border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={inputNums}
                onChange={(e) => setInputNums(e.target.value)}
                placeholder={`Digite ${config.pickCount} números separados por vírgula (ex: 04, 12, 23, 35, 48, 57)`}
                className="surface-high border-0 h-11"
                onKeyDown={(e) => e.key === "Enter" && analisar()}
              />
            </div>
            <button onClick={analisar} className="btn-premium flex items-center gap-2 whitespace-nowrap">
              Analisar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado */}
      {analise && (
        <>
          {/* Números */}
          <Card className="surface-low border-0">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {analise.numeros.map((n, i) => (
                  <NumberOrb key={n} number={n} delay={i} size="lg" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5" style={{ color: scoreColor(analise.scoreEquilibrio) }} />
                <div>
                  <span className="text-xs text-muted-foreground">Score de Equilíbrio</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold" style={{ color: scoreColor(analise.scoreEquilibrio) }}>
                      {analise.scoreEquilibrio}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
                {/* Barra visual */}
                <div className="flex-1 h-2 bg-[#2d3639] rounded-full overflow-hidden max-w-xs">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${analise.scoreEquilibrio}%`,
                      background: scoreColor(analise.scoreEquilibrio),
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="surface-low border-0">
              <CardContent className="pt-4 pb-4 text-center">
                <span className="text-xs text-muted-foreground block mb-1">Pares / Ímpares</span>
                <span className="text-xl font-bold">
                  <span className="text-primary">{analise.pares}</span>
                  {" / "}
                  <span className="text-secondary">{analise.impares}</span>
                </span>
              </CardContent>
            </Card>
            <Card className="surface-low border-0">
              <CardContent className="pt-4 pb-4 text-center">
                <span className="text-xs text-muted-foreground block mb-1">Soma</span>
                <span className="text-xl font-bold text-primary">{analise.soma}</span>
              </CardContent>
            </Card>
            <Card className="surface-low border-0">
              <CardContent className="pt-4 pb-4 text-center">
                <span className="text-xs text-muted-foreground block mb-1">Dist. Média</span>
                <span className="text-xl font-bold">{analise.distanciaMedia.toFixed(1)}</span>
              </CardContent>
            </Card>
            <Card className="surface-low border-0">
              <CardContent className="pt-4 pb-4 text-center">
                <span className="text-xs text-muted-foreground block mb-1">Sequências</span>
                <span className="text-xl font-bold">{analise.sequencias.length}</span>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição por faixas */}
          <Card className="surface-low border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Distribuição por Faixa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analise.distribuicaoFaixas}>
                    <XAxis dataKey="faixa" tick={{ fill: "#8a9a9e", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8a9a9e", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#182124",
                        border: "1px solid rgba(62, 73, 66, 0.2)",
                        borderRadius: "8px",
                        color: "#dae4e8",
                      }}
                    />
                    <Bar dataKey="count" fill="#6edba6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sequências */}
          {analise.sequencias.length > 0 && (
            <Card className="surface-low border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Sequências Encontradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analise.sequencias.map((seq, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">#{i + 1}</span>
                      <div className="flex gap-1">
                        {seq.map((n) => (
                          <NumberOrb key={n} number={n} size="sm" variant="hot" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({seq.length} consecutivos)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
