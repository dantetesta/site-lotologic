// Tipos das loterias suportadas
export type LotteryType =
  | "megasena"
  | "lotofacil"
  | "quina"
  | "lotomania"
  | "maismilionaria"
  | "duplasena"
  | "timemania"
  | "diadesorte"
  | "supersete"

export interface LotteryConfig {
  id: LotteryType
  nome: string
  nomeExibicao: string
  cor: string
  corSecundaria: string
  poolSize: number
  pickCount: number
  maxPick?: number
  ranges: number[][]
  icon: string
  precoAposta: number
}

export interface Resultado {
  id: number
  loteria: LotteryType
  concurso: number
  data: string
  numeros: number[]
  premioAcumulado?: number
  ganhadores?: {
    faixa: string
    ganhadores: number
    premio: number
  }[]
}

export interface Jogo {
  id: string
  userId?: string
  loteria: LotteryType
  nome: string
  numeros: number[]
  estrategia: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Conferencia {
  id: string
  jogoId: string
  concurso: number
  acertos: number
  numerosAcertados: number[]
  premio: number
  createdAt: string
}

export interface StatsNumero {
  numero: number
  frequencia: number
  percentual: number
  atraso: number
  maxAtraso: number
  mediaAtraso: number
}

export interface DashboardStats {
  ultimoConcurso: Resultado
  totalConcursos: number
  numerosQuentes: StatsNumero[]
  numerosFrios: StatsNumero[]
  distribuicaoParidade: { pares: number; impares: number }[]
  distribuicaoSoma: { faixa: string; count: number }[]
  frequencias: StatsNumero[]
}

export interface GeneratorStrategy {
  id: string
  nome: string
  descricao: string
  icon: string
}

export interface Anuncio {
  id: string
  tipo: "adsense" | "vip"
  nome: string
  posicao: "sidebar" | "header" | "inline" | "footer" | "modal"
  codigo?: string
  urlDestino?: string
  imagemUrl?: string
  ativo: boolean
  impressoes: number
  clicks: number
  ordem: number
}

export interface Visita {
  id: string
  pagina: string
  referrer?: string
  userAgent?: string
  ip?: string
  userId?: string
  createdAt: string
}

export interface ConfigSistema {
  chave: string
  valor: string
  descricao: string
}
