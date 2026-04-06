import Link from "next/link"
import {
  BarChart3,
  Sparkles,
  Search,
  Flame,
  ScanLine,
  Star,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    desc: "Estatísticas detalhadas de todas as 9 loterias da CAIXA com gráficos interativos.",
  },
  {
    icon: Sparkles,
    title: "Gerador Inteligente",
    desc: "7 estratégias matemáticas incluindo algoritmo genético, Markov e Monte Carlo.",
  },
  {
    icon: Flame,
    title: "Mapa de Calor",
    desc: "Visualize números quentes e frios no formato do volante da lotérica.",
  },
  {
    icon: ScanLine,
    title: "Raio-X do Jogo",
    desc: "Análise profunda de paridade, sequências, dispersão e score estrutural.",
  },
  {
    icon: Star,
    title: "Salve seus Jogos",
    desc: "Crie uma conta gratuita e salve seus jogos para conferir automaticamente.",
  },
  {
    icon: Shield,
    title: "100% Gratuito",
    desc: "Sem pegadinhas. Use todas as ferramentas sem pagar nada.",
  },
]

const loterias = [
  { nome: "Mega-Sena", cor: "#209869" },
  { nome: "Lotofácil", cor: "#930089" },
  { nome: "Quina", cor: "#260085" },
  { nome: "Lotomania", cor: "#f78100" },
  { nome: "+Milionária", cor: "#002d6b" },
  { nome: "Dupla Sena", cor: "#a61324" },
  { nome: "Timemania", cor: "#00ff48" },
  { nome: "Dia de Sorte", cor: "#cb7917" },
  { nome: "Super Sete", cor: "#a8cf45" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen surface-base">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6edba6]/5 via-transparent to-[#e9c349]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#6edba6]/5 blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 lg:pt-32 lg:pb-36">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium surface-high text-[#e9c349] border border-[#e9c349]/20">
              <Zap className="w-3 h-3" />
              9 Loterias da CAIXA — Dados Históricos Completos
            </span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient-green">Análise Inteligente</span>
            <br />
            <span className="text-foreground">de Loterias</span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Consulte resultados, analise estatísticas e gere jogos com base em
            matemática real. Sem promessas mágicas — apenas{" "}
            <span className="text-primary font-medium">dados e estratégia</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-premium inline-flex items-center gap-2 text-base"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gerador"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-border/40 text-foreground hover:bg-accent transition-all"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Gerar Jogos
            </Link>
          </div>

          {/* Loterias badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
            {loterias.map((lot) => (
              <span
                key={lot.nome}
                className="px-3 py-1 rounded-full text-xs font-medium text-white/90"
                style={{ background: `${lot.cor}cc` }}
              >
                {lot.nome}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Tudo que você precisa,{" "}
            <span className="text-gradient-gold">em um só lugar</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ferramentas profissionais de análise acessíveis para qualquer
            pessoa. Sem complicação.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="glass-card group hover:bg-[#1e2a2e]/60 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="glass-card text-center py-12 bg-gradient-premium">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Pronto para jogar com{" "}
            <span className="text-gradient-green">inteligência</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Acesse agora mesmo. Não precisa de cadastro para usar as
            ferramentas básicas.
          </p>
          <Link
            href="/dashboard"
            className="btn-premium inline-flex items-center gap-2"
          >
            Acessar o LotoLogic
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6edba6] to-[#30a373] flex items-center justify-center text-[10px] font-bold text-[#003822]">
              L
            </div>
            <span className="text-sm text-muted-foreground">
              LotoLogic &copy; {new Date().getFullYear()} — por Dante Testa
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center sm:text-right max-w-md">
            Este site não promete prever resultados. Todas as análises são
            baseadas em histórico e estatística.
          </p>
        </div>
      </footer>
    </div>
  )
}
