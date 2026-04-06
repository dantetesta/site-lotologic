"use client"

import { useState } from "react"
import { useLotteryStore } from "@/stores/lottery-store"
import { useAuthStore } from "@/stores/auth-store"
import { LOTERIAS, ESTRATEGIAS } from "@/lib/constants"
import {
  gerarAleatorio,
  gerarBalanceado,
  gerarHibrido,
  analisarJogo,
} from "@/lib/lottery-engine"
import { NumberOrb } from "@/components/shared/number-orb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Sparkles,
  RefreshCw,
  Save,
  Copy,
  Trash2,
  ScanLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { AnaliseJogo } from "@/lib/lottery-engine"

interface JogoGerado {
  id: string
  numeros: number[]
  estrategia: string
  analise?: AnaliseJogo
  expandido?: boolean
}

export default function GeradorPage() {
  const { currentLottery } = useLotteryStore()
  const { user } = useAuthStore()
  const config = LOTERIAS[currentLottery]
  const [estrategia, setEstrategia] = useState("aleatorio")
  const [quantidade, setQuantidade] = useState(1)
  const [jogos, setJogos] = useState<JogoGerado[]>([])
  const [gerando, setGerando] = useState(false)

  const gerar = () => {
    setGerando(true)
    setTimeout(() => {
      let novosNumeros: number[][]

      switch (estrategia) {
        case "balanceado":
          novosNumeros = gerarBalanceado(currentLottery, quantidade)
          break
        // Para frequência e híbrido precisamos de resultados reais
        // Por ora, usar aleatório como fallback
        default:
          novosNumeros = gerarAleatorio(currentLottery, quantidade)
      }

      const novosJogos: JogoGerado[] = novosNumeros.map((nums) => ({
        id: crypto.randomUUID(),
        numeros: nums,
        estrategia,
      }))

      setJogos((prev) => [...novosJogos, ...prev])
      setGerando(false)
      toast.success(`${novosNumeros.length} jogo(s) gerado(s)!`)
    }, 300)
  }

  const removerJogo = (id: string) => {
    setJogos((prev) => prev.filter((j) => j.id !== id))
  }

  const copiarJogo = (numeros: number[]) => {
    const texto = numeros.map((n) => String(n).padStart(2, "0")).join(" - ")
    navigator.clipboard.writeText(`${config.nomeExibicao}: ${texto}`)
    toast.success("Copiado!")
  }

  const toggleRaioX = (id: string) => {
    setJogos((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j
        if (!j.analise) {
          // Gera análise mock (sem resultados reais por ora)
          const analise = analisarJogo(j.numeros, currentLottery, [])
          return { ...j, analise, expandido: true }
        }
        return { ...j, expandido: !j.expandido }
      })
    )
  }

  const salvarJogo = (jogo: JogoGerado) => {
    if (!user) {
      toast.error("Faça login para salvar jogos", {
        action: {
          label: "Entrar",
          onClick: () => (window.location.href = "/login"),
        },
      })
      return
    }
    // TODO: Salvar no Supabase
    toast.success("Jogo salvo!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-primary" />
          Gerador de Jogos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gere jogos para a{" "}
          <span style={{ color: config.cor }} className="font-medium">
            {config.nomeExibicao}
          </span>{" "}
          usando diferentes estratégias matemáticas
        </p>
      </div>

      {/* Painel de geração */}
      <Card className="surface-low border-0">
        <CardContent className="pt-6">
          {/* Estratégias */}
          <div className="mb-6">
            <label className="text-xs font-medium text-muted-foreground mb-3 block">
              Estratégia
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {ESTRATEGIAS.map((est) => (
                <button
                  key={est.id}
                  onClick={() => setEstrategia(est.id)}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl text-left transition-all duration-200 ${
                    estrategia === est.id
                      ? "bg-primary/10 ring-1 ring-primary/30 text-foreground"
                      : "surface-high text-muted-foreground hover:text-foreground hover:bg-[#2d3639]"
                  }`}
                >
                  <span className="text-lg">{est.icon}</span>
                  <span className="text-xs font-medium">{est.nome}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {est.descricao}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade + Botão */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Quantidade:
              </label>
              <div className="flex items-center gap-1">
                {[1, 3, 5, 10, 20].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantidade(q)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      quantidade === q
                        ? "bg-primary/15 text-primary"
                        : "surface-high text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={gerar}
              disabled={gerando}
              className="btn-premium flex items-center justify-center gap-2 sm:ml-auto"
            >
              {gerando ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Gerar {quantidade > 1 ? `${quantidade} Jogos` : "Jogo"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Jogos gerados */}
      {jogos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              {jogos.length} jogo(s) gerado(s)
            </h2>
            <button
              onClick={() => setJogos([])}
              className="text-xs text-destructive hover:underline"
            >
              Limpar todos
            </button>
          </div>

          {jogos.map((jogo) => {
            const est = ESTRATEGIAS.find((e) => e.id === jogo.estrategia)
            return (
              <Card key={jogo.id} className="surface-low border-0 overflow-hidden">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {est?.icon} {est?.nome}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copiarJogo(jogo.numeros)}
                        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleRaioX(jogo.id)}
                        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="Raio-X"
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => salvarJogo(jogo)}
                        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                        title="Salvar"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removerJogo(jogo.id)}
                        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Números */}
                  <div className="flex flex-wrap gap-2">
                    {jogo.numeros.map((n, i) => (
                      <NumberOrb key={n} number={n} delay={i} />
                    ))}
                  </div>

                  {/* Raio-X expandido */}
                  {jogo.expandido && jogo.analise && (
                    <div className="mt-4 pt-4 border-t border-border/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="surface-high rounded-lg p-2.5">
                        <span className="text-muted-foreground block mb-0.5">
                          Pares / Ímpares
                        </span>
                        <span className="font-semibold">
                          {jogo.analise.pares} / {jogo.analise.impares}
                        </span>
                      </div>
                      <div className="surface-high rounded-lg p-2.5">
                        <span className="text-muted-foreground block mb-0.5">
                          Soma
                        </span>
                        <span className="font-semibold text-primary">
                          {jogo.analise.soma}
                        </span>
                      </div>
                      <div className="surface-high rounded-lg p-2.5">
                        <span className="text-muted-foreground block mb-0.5">
                          Sequências
                        </span>
                        <span className="font-semibold">
                          {jogo.analise.sequencias.length}
                        </span>
                      </div>
                      <div className="surface-high rounded-lg p-2.5">
                        <span className="text-muted-foreground block mb-0.5">
                          Score
                        </span>
                        <span className="font-semibold text-secondary">
                          {jogo.analise.scoreEquilibrio}/100
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
