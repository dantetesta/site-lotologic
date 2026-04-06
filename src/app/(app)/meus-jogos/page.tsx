"use client"

import { useState } from "react"
import { useLotteryStore } from "@/stores/lottery-store"
import { LOTERIAS } from "@/lib/constants"
import { NumberOrb } from "@/components/shared/number-orb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2, Copy, ScanLine, Gamepad2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

// Mock
const mockJogos = Array.from({ length: 5 }, (_, i) => {
  const nums: number[] = []
  while (nums.length < 6) {
    const n = Math.floor(Math.random() * 60) + 1
    if (!nums.includes(n)) nums.push(n)
  }
  return {
    id: `jogo-${i + 1}`,
    nome: `Jogo ${i + 1}`,
    loteria: "megasena" as const,
    numeros: nums.sort((a, b) => a - b),
    estrategia: ["aleatorio", "balanceado", "hibrido", "frequencia", "lotocore"][i % 5],
    createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  }
})

export default function MeusJogosPage() {
  const { currentLottery } = useLotteryStore()
  const [jogos, setJogos] = useState(mockJogos)

  const remover = (id: string) => {
    setJogos((prev) => prev.filter((j) => j.id !== id))
    toast.success("Jogo removido")
  }

  const copiar = (numeros: number[]) => {
    const texto = numeros.map((n) => String(n).padStart(2, "0")).join(" - ")
    navigator.clipboard.writeText(texto)
    toast.success("Copiado!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Star className="w-7 h-7 text-secondary" />
            Meus Jogos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {jogos.length} jogo(s) salvo(s)
          </p>
        </div>
        <Link href="/gerador" className="btn-premium text-sm flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          Gerar Mais
        </Link>
      </div>

      {jogos.length === 0 ? (
        <Card className="surface-low border-0">
          <CardContent className="py-16 text-center">
            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-semibold mb-2">Nenhum jogo salvo</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gere jogos no Gerador e salve os que mais gostar
            </p>
            <Link href="/gerador" className="btn-premium inline-flex items-center gap-2 text-sm">
              Ir para o Gerador
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jogos.map((jogo) => (
            <Card key={jogo.id} className="surface-low border-0">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-medium text-sm">{jogo.nome}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {jogo.estrategia}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {jogo.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => copiar(jogo.numeros)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/raio-x?nums=${jogo.numeros.join(",")}`} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <ScanLine className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => remover(jogo.id)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jogo.numeros.map((n, i) => (
                    <NumberOrb key={n} number={n} delay={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
