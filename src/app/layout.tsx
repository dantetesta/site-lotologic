import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "LotoLogic — Análise Inteligente de Loterias",
    template: "%s | LotoLogic",
  },
  description:
    "Analise resultados, gere jogos com estratégias matemáticas e confira suas apostas. 9 modalidades da CAIXA com dados históricos completos.",
  keywords: [
    "loteria",
    "mega-sena",
    "lotofácil",
    "quina",
    "análise",
    "gerador",
    "estatísticas",
    "lotomania",
    "resultados",
    "CAIXA",
  ],
  authors: [{ name: "Dante Testa" }],
  openGraph: {
    title: "LotoLogic — Análise Inteligente de Loterias",
    description:
      "Analise resultados, gere jogos com estratégias matemáticas e confira suas apostas.",
    type: "website",
    locale: "pt_BR",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${manrope.variable} font-sans`}>
        <TooltipProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#182124",
                border: "1px solid rgba(62, 73, 66, 0.2)",
                color: "#dae4e8",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  )
}
