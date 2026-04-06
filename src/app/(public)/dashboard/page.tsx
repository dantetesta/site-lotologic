"use client"

import { useEffect, useState } from "react"
import { useLotteryStore } from "@/stores/lottery-store"
import { LOTERIAS } from "@/lib/constants"
import {
  calcularFrequencias,
  numerosQuentes,
  numerosFrios,
  numerosAtrasados,
  distribuicaoParidade,
  distribuicaoSoma,
} from "@/lib/lottery-engine"
import { NumberOrb } from "@/components/shared/number-orb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, Hash, Trophy, Calendar } from "lucide-react"
import type { Resultado, StatsNumero } from "@/types/lottery"

// Dados mock para demonstração (substituir por API)
function gerarMockResultados(loteria: string, count: number = 100): Resultado[] {
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

export default function DashboardPage() {
  const { currentLottery, periodoFiltro } = useLotteryStore()
  const config = LOTERIAS[currentLottery]
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [stats, setStats] = useState<StatsNumero[]>([])

  useEffect(() => {
    // TODO: Buscar do Supabase
    const data = gerarMockResultados(currentLottery, 500)
    setResultados(data)
    const freq = calcularFrequencias(data, currentLottery, periodoFiltro || undefined)
    setStats(freq)
  }, [currentLottery, periodoFiltro])

  const quentes = numerosQuentes(stats, 10)
  const frios = numerosFrios(stats, 10)
  const atrasados = numerosAtrasados(stats, 10)
  const ultimo = resultados[0]
  const paridade = distribuicaoParidade(resultados)
  const soma = distribuicaoSoma(resultados)

  // Dados do gráfico de frequência (top 20)
  const freqChart = [...stats]
    .sort((a, b) => a.numero - b.numero)
    .slice(0, 30)
    .map((s) => ({
      numero: String(s.numero).padStart(2, "0"),
      freq: s.frequencia,
    }))

  // Paridade média
  const paridadeMedia = paridade.length > 0
    ? {
        pares: Math.round(paridade.reduce((a, b) => a + b.pares, 0) / paridade.length * 10) / 10,
        impares: Math.round(paridade.reduce((a, b) => a + b.impares, 0) / paridade.length * 10) / 10,
      }
    : { pares: 0, impares: 0 }

  const pieData = [
    { name: "Pares", value: paridadeMedia.pares, color: "#6edba6" },
    { name: "Ímpares", value: paridadeMedia.impares, color: "#e9c349" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            Dashboard{" "}
            <span style={{ color: config.cor }}>{config.nomeExibicao}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {resultados.length} concursos analisados
            {periodoFiltro > 0 && ` (últimos ${periodoFiltro})`}
          </p>
        </div>

        {/* Filtro período */}
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
              {p === 0 ? "Todos" : `${p}`}
            </button>
          ))}
        </div>
      </div>

      {/* Último concurso */}
      {ultimo && (
        <Card className="surface-low border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Último Concurso
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    #{ultimo.concurso}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ultimo.data}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ultimo.numeros.map((n, i) => (
                  <NumberOrb key={n} number={n} delay={i} size="lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Números Quentes */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Mais Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {quentes.map((s, i) => (
                <div key={s.numero} className="text-center">
                  <NumberOrb number={s.numero} variant="hot" size="sm" delay={i} />
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {s.frequencia}x
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Números Frios */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-400" />
              Menos Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {frios.map((s, i) => (
                <div key={s.numero} className="text-center">
                  <NumberOrb number={s.numero} variant="cold" size="sm" delay={i} />
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {s.frequencia}x
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atrasados */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              Mais Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {atrasados.map((s, i) => (
                <div key={s.numero} className="text-center">
                  <NumberOrb number={s.numero} variant="cold" size="sm" delay={i} />
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {s.atraso}c
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Gráfico de frequência */}
        <Card className="surface-low border-0 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-primary" />
              Frequência por Número
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={freqChart}>
                  <XAxis
                    dataKey="numero"
                    tick={{ fill: "#8a9a9e", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8a9a9e", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#182124",
                      border: "1px solid rgba(62, 73, 66, 0.2)",
                      borderRadius: "8px",
                      color: "#dae4e8",
                    }}
                  />
                  <Bar
                    dataKey="freq"
                    radius={[4, 4, 0, 0]}
                    fill={config.cor}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Paridade */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Distribuição Par/Ímpar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#182124",
                      border: "1px solid rgba(62, 73, 66, 0.2)",
                      borderRadius: "8px",
                      color: "#dae4e8",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Pares: {paridadeMedia.pares}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                Ímpares: {paridadeMedia.impares}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de soma */}
      <Card className="surface-low border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Distribuição de Soma dos Números
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={soma}>
                <XAxis
                  dataKey="faixa"
                  tick={{ fill: "#8a9a9e", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8a9a9e", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#182124",
                    border: "1px solid rgba(62, 73, 66, 0.2)",
                    borderRadius: "8px",
                    color: "#dae4e8",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#e9c349" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
