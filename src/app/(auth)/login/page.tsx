"use client"

import { useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")

function LoginContent() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${appUrl}/api/auth/callback?redirect=${redirect}`,
        },
      })

      if (error) throw error
      setEnviado(true)
      toast.success("Link mágico enviado! Verifique seu email.")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao enviar email"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appUrl}/api/auth/callback?redirect=${redirect}`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao conectar com Google"
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen surface-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6edba6] to-[#30a373] flex items-center justify-center font-bold text-lg text-[#003822]">
              L
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Entrar ou Criar Conta</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Crie sua conta grátis ou entre para salvar jogos e conferir resultados
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl surface-high hover:bg-[#2d3639] text-foreground font-medium text-sm transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <hr className="flex-1" />
          <span className="text-xs text-muted-foreground">ou</span>
          <hr className="flex-1" />
        </div>

        {/* Magic Link */}
        {enviado ? (
          <div className="text-center surface-low rounded-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-semibold mb-2">Verifique seu email!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enviamos um link mágico para{" "}
              <strong className="text-foreground">{email}</strong>. Clique no
              link para entrar.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="text-xs text-primary hover:underline"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 surface-high border-0 h-11"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="btn-premium w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Enviar Link Mágico
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Info */}
        <p className="text-[10px] text-muted-foreground/60 text-center mt-6 leading-relaxed">
          Se você ainda não tem conta, uma será criada automaticamente.
          Sem senha — enviamos um link mágico que expira em 15 minutos.
        </p>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar ao LotoLogic
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen surface-base flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
