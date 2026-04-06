import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Sparkles,
  Flame,
  ScanLine,
  Star,
  Shield,
  Zap,
  ArrowRight,
  Monitor,
  Globe,
  Download,
  CheckCircle,
  Bot,
  Users,
  Play,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Completo",
    desc: "Estatísticas detalhadas de todas as 9 loterias da CAIXA com gráficos interativos e filtros por período.",
  },
  {
    icon: Sparkles,
    title: "7 Estratégias de Geração",
    desc: "Aleatório, frequência, balanceado, híbrido, atrasados e o motor LotoCore com IA e algoritmo genético.",
  },
  {
    icon: Flame,
    title: "Mapa de Calor",
    desc: "Visualize números quentes e frios no formato real do volante da lotérica.",
  },
  {
    icon: ScanLine,
    title: "Raio-X do Jogo",
    desc: "Análise profunda: paridade, sequências, dispersão, distribuição por faixas e score de equilíbrio.",
  },
  {
    icon: Star,
    title: "Salve seus Jogos",
    desc: "Crie uma conta gratuita, salve seus jogos favoritos e confira resultados automaticamente.",
  },
  {
    icon: Bot,
    title: "Assistente IA",
    desc: "Pergunte sobre estratégias, analise padrões e receba insights baseados em dados reais.",
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

const stats = [
  { value: "23.000+", label: "Concursos Históricos" },
  { value: "9", label: "Loterias da CAIXA" },
  { value: "7", label: "Estratégias de Geração" },
  { value: "100%", label: "Gratuito" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen surface-base">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border/10"
        style={{ background: "rgba(12, 21, 24, 0.85)", backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-lotologic.png"
            alt="LotoLogic"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-bold text-lg tracking-tight">LotoLogic</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#recursos" className="hover:text-foreground transition-colors">Recursos</a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">Como Funciona</a>
          <a href="#download" className="hover:text-foreground transition-colors">Download</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/dashboard"
            className="btn-premium text-xs px-4 py-2"
          >
            Usar Online
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6edba6]/5 via-transparent to-[#e9c349]/5" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#6edba6]/5 blur-[150px]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 lg:pt-24 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium surface-high text-[#e9c349] border border-[#e9c349]/20 mb-6">
                <Zap className="w-3 h-3" />
                23.000+ concursos analisados — Atualização diária
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="text-gradient-green">Análise Inteligente</span>
                <br />
                de Loterias da CAIXA
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Substitua o achismo por{" "}
                <span className="text-primary font-medium">dados reais e estatística</span>.
                Use direto no navegador ou baixe o app desktop. 9 loterias, 7 estratégias
                de geração e IA integrada — 100% gratuito.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/dashboard"
                  className="btn-premium inline-flex items-center justify-center gap-2 text-base"
                >
                  <Globe className="w-4 h-4" />
                  Usar Online Grátis
                </Link>
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-border/40 text-foreground hover:bg-accent transition-all"
                >
                  <Download className="w-4 h-4 text-secondary" />
                  Baixar Desktop
                </a>
              </div>

              {/* Social proof */}
              <p className="text-xs text-muted-foreground/60">
                <Shield className="w-3 h-3 inline mr-1" />
                Sem cadastro obrigatório. Sem pagamento. Sem promessas mágicas.
              </p>
            </div>

            {/* Right: Video */}
            <div className="relative">
              <div className="glass-card p-2 glow-green">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/hero-author.png"
                  className="rounded-xl w-full"
                >
                  <source src="/video-demo.mp4" type="video/mp4" />
                </video>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2.5 flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-foreground font-medium">Atualização diária</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center glass-card py-4">
                <span className="text-2xl lg:text-3xl font-bold text-gradient-green">
                  {s.value}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Loterias badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
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

      {/* Duas formas de usar */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Duas formas de usar,{" "}
            <span className="text-gradient-gold">mesma inteligência</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escolha como preferir. O motor de análise é o mesmo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Online */}
          <div className="glass-card group hover:bg-[#1e2a2e]/60 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Versão Online</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Acesse direto pelo navegador, sem instalar nada. Gere jogos, veja estatísticas
                e analise resultados. Crie uma conta gratuita para salvar seus jogos.
              </p>
              <ul className="space-y-2 mb-6">
                {["Sem instalação", "Funciona no celular", "Salve jogos na nuvem", "Conferência automática", "Login sem senha (Magic Link)"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="btn-premium inline-flex items-center gap-2 text-sm">
                Acessar Agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Desktop */}
          <div className="glass-card group hover:bg-[#1e2a2e]/60 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px]" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">App Desktop</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Instale no seu computador. Funciona 100% offline após sincronizar os dados.
                Mais rápido, com motor LotoCore completo.
              </p>
              <ul className="space-y-2 mb-6">
                {["Windows, macOS e Linux", "Funciona offline", "Motor LotoCore avançado", "21 algoritmos", "Roda independente"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#download" className="btn-premium-gold inline-flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Baixar Grátis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="recursos" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Tudo que você precisa,{" "}
            <span className="text-gradient-green">em um só lugar</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ferramentas profissionais de análise acessíveis para qualquer pessoa.
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
              <h3 className="font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download section */}
      <section id="download" className="max-w-4xl mx-auto px-4 py-20">
        <div className="glass-card text-center py-12 bg-gradient-premium relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6edba6]/5 to-[#e9c349]/5" />
          <div className="relative">
            <Image
              src="/logo-lotologic.png"
              alt="LotoLogic"
              width={64}
              height={64}
              className="mx-auto mb-6 rounded-xl"
            />
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Baixe o LotoLogic Desktop
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
              Versão {" "}
              <span className="text-primary font-medium">4.2.8</span> — Windows, macOS e Linux. 100% gratuito, sem cadastro.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/dantetesta/LotoLogic/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium-gold inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Grátis
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-border/40 text-foreground hover:bg-accent transition-all"
              >
                <Globe className="w-4 h-4 text-primary" />
                Ou use online
              </Link>
            </div>

            <p className="text-[10px] text-muted-foreground/50 mt-6">
              O app desktop funciona de forma independente. Não precisa de conta nem internet (após sincronizar).
            </p>
          </div>
        </div>
      </section>

      {/* CTA criar conta */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="glass-card py-10 px-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">
              Quer salvar seus jogos?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crie uma conta gratuita em 10 segundos. Sem senha — enviamos um link mágico
              pro seu email. Ou entre com Google. Simples assim.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="btn-premium inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              Criar Conta Grátis
            </Link>
            <span className="text-[10px] text-muted-foreground/60 text-center">
              Magic Link ou Google — sem senha
            </span>
          </div>
        </div>
      </section>

      {/* Disclaimer + Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-lotologic.png"
                alt="LotoLogic"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm text-muted-foreground">
                LotoLogic &copy; {new Date().getFullYear()} — por{" "}
                <span className="text-foreground">Dante Testa</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/gerador" className="hover:text-foreground transition-colors">Gerador</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link>
              <a href="https://github.com/dantetesta/LotoLogic/releases/latest" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Download</a>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center leading-relaxed">
            Este site e o aplicativo LotoLogic NÃO prometem prever resultados de loterias.
            Todas as análises são baseadas em dados históricos e estatística. Loteria é jogo de azar
            e nenhum software pode garantir prêmios. Jogue com responsabilidade.
          </p>
        </div>
      </footer>
    </div>
  )
}
