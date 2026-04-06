/**
 * LotoLogic Engine — Motor de cálculos no browser
 * Roda 100% client-side, sem peso no servidor
 */

import type { Resultado, StatsNumero, LotteryType } from "@/types/lottery"
import { LOTERIAS } from "@/lib/constants"

// ============================================
// Estatísticas
// ============================================

export function calcularFrequencias(
  resultados: Resultado[],
  loteria: LotteryType,
  limite?: number
): StatsNumero[] {
  const config = LOTERIAS[loteria]
  const dados = limite ? resultados.slice(0, limite) : resultados
  const total = dados.length
  if (total === 0) return []

  const freq: Record<number, number> = {}
  const ultimaAparicao: Record<number, number> = {}

  // Inicializar todos os números do pool
  for (let i = (loteria === "lotomania" ? 0 : 1); i <= config.poolSize - (loteria === "lotomania" ? 1 : 0); i++) {
    freq[i] = 0
    ultimaAparicao[i] = -1
  }

  // Contar frequências e última aparição
  dados.forEach((r, idx) => {
    r.numeros.forEach((n) => {
      freq[n] = (freq[n] || 0) + 1
      if (ultimaAparicao[n] === -1) {
        ultimaAparicao[n] = idx
      }
    })
  })

  return Object.keys(freq)
    .map((n) => {
      const num = Number(n)
      return {
        numero: num,
        frequencia: freq[num],
        percentual: total > 0 ? (freq[num] / total) * 100 : 0,
        atraso: ultimaAparicao[num] === -1 ? total : ultimaAparicao[num],
        maxAtraso: 0, // calculado se necessário
        mediaAtraso: total > 0 ? total / Math.max(freq[num], 1) : 0,
      }
    })
    .sort((a, b) => b.frequencia - a.frequencia)
}

export function numerosQuentes(stats: StatsNumero[], top: number = 10): StatsNumero[] {
  return [...stats].sort((a, b) => b.frequencia - a.frequencia).slice(0, top)
}

export function numerosFrios(stats: StatsNumero[], top: number = 10): StatsNumero[] {
  return [...stats].sort((a, b) => a.frequencia - b.frequencia).slice(0, top)
}

export function numerosAtrasados(stats: StatsNumero[], top: number = 10): StatsNumero[] {
  return [...stats].sort((a, b) => b.atraso - a.atraso).slice(0, top)
}

export function distribuicaoParidade(resultados: Resultado[]): { pares: number; impares: number }[] {
  return resultados.slice(0, 50).map((r) => {
    const pares = r.numeros.filter((n) => n % 2 === 0).length
    return { pares, impares: r.numeros.length - pares }
  })
}

export function distribuicaoSoma(resultados: Resultado[]): { faixa: string; count: number }[] {
  const somas = resultados.map((r) => r.numeros.reduce((a, b) => a + b, 0))
  const min = Math.min(...somas)
  const max = Math.max(...somas)
  const step = Math.ceil((max - min) / 8)

  const faixas: Record<string, number> = {}
  for (let i = min; i <= max; i += step) {
    const label = `${i}-${Math.min(i + step - 1, max)}`
    faixas[label] = 0
  }

  somas.forEach((s) => {
    const idx = Math.floor((s - min) / step)
    const keys = Object.keys(faixas)
    const key = keys[Math.min(idx, keys.length - 1)]
    if (key) faixas[key]++
  })

  return Object.entries(faixas).map(([faixa, count]) => ({ faixa, count }))
}

// ============================================
// Geradores
// ============================================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getPool(loteria: LotteryType): number[] {
  const config = LOTERIAS[loteria]
  const start = loteria === "lotomania" ? 0 : 1
  const end = loteria === "lotomania" ? config.poolSize - 1 : config.poolSize
  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

export function gerarAleatorio(loteria: LotteryType, quantidade: number = 1): number[][] {
  const config = LOTERIAS[loteria]
  const pool = getPool(loteria)
  return Array.from({ length: quantidade }, () =>
    shuffle(pool).slice(0, config.pickCount).sort((a, b) => a - b)
  )
}

export function gerarPorFrequencia(
  loteria: LotteryType,
  resultados: Resultado[],
  quantidade: number = 1
): number[][] {
  const config = LOTERIAS[loteria]
  const stats = calcularFrequencias(resultados, loteria)

  return Array.from({ length: quantidade }, () => {
    // Weighted selection baseada em frequência
    const weights = stats.map((s) => s.frequencia + 1)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const selected: number[] = []

    while (selected.length < config.pickCount) {
      let r = Math.random() * totalWeight
      for (let i = 0; i < stats.length; i++) {
        r -= weights[i]
        if (r <= 0 && !selected.includes(stats[i].numero)) {
          selected.push(stats[i].numero)
          break
        }
      }
    }

    return selected.sort((a, b) => a - b)
  })
}

export function gerarPorFrequenciaRecente(
  loteria: LotteryType,
  resultados: Resultado[],
  quantidade: number = 1
): number[][] {
  const recentes = resultados.slice(0, 30)
  return gerarPorFrequencia(loteria, recentes, quantidade)
}

export function gerarAtrasados(
  loteria: LotteryType,
  resultados: Resultado[],
  quantidade: number = 1
): number[][] {
  const config = LOTERIAS[loteria]
  const stats = calcularFrequencias(resultados, loteria)
  const atrasados = [...stats].sort((a, b) => b.atraso - a.atraso)

  return Array.from({ length: quantidade }, () => {
    const weights = atrasados.map((s) => s.atraso + 1)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const selected: number[] = []

    while (selected.length < config.pickCount) {
      let r = Math.random() * totalWeight
      for (let i = 0; i < atrasados.length; i++) {
        r -= weights[i]
        if (r <= 0 && !selected.includes(atrasados[i].numero)) {
          selected.push(atrasados[i].numero)
          break
        }
      }
    }

    return selected.sort((a, b) => a - b)
  })
}

export function gerarBalanceado(
  loteria: LotteryType,
  quantidade: number = 1
): number[][] {
  const config = LOTERIAS[loteria]
  const pool = getPool(loteria)

  return Array.from({ length: quantidade }, () => {
    // Tenta até 500 vezes encontrar um jogo equilibrado
    for (let attempt = 0; attempt < 500; attempt++) {
      const nums = shuffle(pool).slice(0, config.pickCount).sort((a, b) => a - b)
      const pares = nums.filter((n) => n % 2 === 0).length
      const impares = nums.length - pares

      // Verifica equilíbrio par/ímpar (diferença máxima de 2)
      if (Math.abs(pares - impares) <= 2) {
        // Verifica distribuição por faixas
        const faixaSize = Math.ceil(config.poolSize / config.ranges.length)
        const porFaixa = config.ranges.map(
          ([min, max]) => nums.filter((n) => n >= min && n <= max).length
        )
        const maxPorFaixa = Math.max(...porFaixa)
        if (maxPorFaixa <= Math.ceil(config.pickCount / config.ranges.length) + 1) {
          return nums
        }
      }
    }
    // Fallback: retorna aleatório
    return shuffle(pool).slice(0, config.pickCount).sort((a, b) => a - b)
  })
}

export function gerarHibrido(
  loteria: LotteryType,
  resultados: Resultado[],
  quantidade: number = 1
): number[][] {
  const config = LOTERIAS[loteria]
  const stats = calcularFrequencias(resultados, loteria)
  const statsRecentes = calcularFrequencias(resultados.slice(0, 30), loteria)

  return Array.from({ length: quantidade }, () => {
    // Score composto: frequência + frequência recente + atraso
    const scored = stats.map((s) => {
      const recente = statsRecentes.find((r) => r.numero === s.numero)
      const freqScore = s.percentual / 100
      const recenteScore = recente ? recente.percentual / 100 : 0
      const atrasoScore = Math.min(s.atraso / 20, 1)
      return {
        numero: s.numero,
        score: freqScore * 0.3 + recenteScore * 0.4 + atrasoScore * 0.3,
      }
    })

    // Weighted selection pelo score
    const totalScore = scored.reduce((a, b) => a + b.score, 0)
    const selected: number[] = []

    for (let attempt = 0; attempt < 300 && selected.length < config.pickCount; attempt++) {
      let r = Math.random() * totalScore
      for (const s of scored) {
        r -= s.score
        if (r <= 0 && !selected.includes(s.numero)) {
          selected.push(s.numero)
          break
        }
      }
    }

    // Preencher se faltou
    if (selected.length < config.pickCount) {
      const pool = getPool(loteria).filter((n) => !selected.includes(n))
      selected.push(...shuffle(pool).slice(0, config.pickCount - selected.length))
    }

    return selected.sort((a, b) => a - b)
  })
}

// ============================================
// Análise de Jogo (Raio-X)
// ============================================

export interface AnaliseJogo {
  numeros: number[]
  pares: number
  impares: number
  soma: number
  mediaNumeros: number
  sequencias: number[][]
  distribuicaoFaixas: { faixa: string; count: number }[]
  distanciaMedia: number
  dispersao: number
  scoreEquilibrio: number
  frequenciaHistorica: { numero: number; freq: number; status: string }[]
}

export function analisarJogo(
  numeros: number[],
  loteria: LotteryType,
  resultados: Resultado[]
): AnaliseJogo {
  const config = LOTERIAS[loteria]
  const sorted = [...numeros].sort((a, b) => a - b)
  const stats = calcularFrequencias(resultados, loteria)

  // Paridade
  const pares = sorted.filter((n) => n % 2 === 0).length
  const impares = sorted.length - pares

  // Soma e média
  const soma = sorted.reduce((a, b) => a + b, 0)
  const mediaNumeros = soma / sorted.length

  // Sequências consecutivas
  const sequencias: number[][] = []
  let seq: number[] = [sorted[0]]
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      seq.push(sorted[i])
    } else {
      if (seq.length >= 2) sequencias.push([...seq])
      seq = [sorted[i]]
    }
  }
  if (seq.length >= 2) sequencias.push(seq)

  // Distribuição por faixas
  const distribuicaoFaixas = config.ranges.map(([min, max]) => ({
    faixa: `${String(min).padStart(2, "0")}-${String(max).padStart(2, "0")}`,
    count: sorted.filter((n) => n >= min && n <= max).length,
  }))

  // Distância média entre números
  const gaps = sorted.slice(1).map((n, i) => n - sorted[i])
  const distanciaMedia = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0

  // Dispersão (desvio padrão dos gaps)
  const meanGap = distanciaMedia
  const variance = gaps.reduce((sum, g) => sum + (g - meanGap) ** 2, 0) / Math.max(gaps.length, 1)
  const dispersao = Math.sqrt(variance)

  // Score de equilíbrio (0-100)
  const parityBalance = 1 - Math.abs(pares - impares) / sorted.length
  const rangeBalance =
    1 -
    distribuicaoFaixas.reduce((max, f) => Math.max(max, f.count), 0) /
      sorted.length
  const gapBalance = distanciaMedia > 0 ? Math.min(1, 5 / dispersao) : 0
  const scoreEquilibrio = Math.round((parityBalance * 0.35 + rangeBalance * 0.35 + gapBalance * 0.3) * 100)

  // Frequência histórica de cada número
  const avgFreq = stats.reduce((a, b) => a + b.frequencia, 0) / stats.length
  const frequenciaHistorica = sorted.map((n) => {
    const s = stats.find((st) => st.numero === n)
    const freq = s?.frequencia ?? 0
    let status = "normal"
    if (freq > avgFreq * 1.15) status = "quente"
    else if (freq < avgFreq * 0.85) status = "frio"
    return { numero: n, freq, status }
  })

  return {
    numeros: sorted,
    pares,
    impares,
    soma,
    mediaNumeros,
    sequencias,
    distribuicaoFaixas,
    distanciaMedia,
    dispersao,
    scoreEquilibrio,
    frequenciaHistorica,
  }
}
