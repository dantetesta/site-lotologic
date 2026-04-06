"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Brain, Mail, Megaphone, Globe, Save, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function ConfigPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const [config, setConfig] = useState({
    // IA
    gemini_api_key: "",
    openrouter_api_key: "",
    ai_model_primary: "gemini-2.0-flash",
    ai_model_fallback: "deepseek/deepseek-chat-v3-0324:free",
    // Email
    resend_api_key: "",
    smtp_from: "suporte@dantetesta.com.br",
    // Anúncios
    adsense_client_id: "",
    // Geral
    site_nome: "LotoLogic",
    site_descricao: "Análise inteligente de loterias da CAIXA",
    site_keywords: "loteria, mega-sena, lotofácil, análise, gerador, estatísticas",
    manutencao: false,
    registro_aberto: true,
  })

  const update = (key: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const salvar = () => {
    // TODO: Salvar no Supabase config_sistema
    toast.success("Configurações salvas!")
  }

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const PasswordInput = ({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) => (
    <div className="relative">
      <Input
        type={showKeys[id] ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="surface-high border-0 pr-10 font-mono text-xs"
        placeholder="••••••••••"
      />
      <button
        type="button"
        onClick={() => toggleShowKey(id)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground"
      >
        {showKeys[id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-muted-foreground" />
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            API keys, SMTP, anúncios e configurações gerais
          </p>
        </div>
        <button onClick={salvar} className="btn-premium flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList className="surface-high border-0 p-1">
          <TabsTrigger value="ai" className="text-xs gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            IA
          </TabsTrigger>
          <TabsTrigger value="email" className="text-xs gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Email
          </TabsTrigger>
          <TabsTrigger value="anuncios" className="text-xs gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            Anúncios
          </TabsTrigger>
          <TabsTrigger value="geral" className="text-xs gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Geral
          </TabsTrigger>
        </TabsList>

        {/* IA */}
        <TabsContent value="ai">
          <Card className="surface-low border-0">
            <CardHeader>
              <CardTitle className="text-sm">Inteligência Artificial</CardTitle>
              <p className="text-xs text-muted-foreground">
                Gemini AI Studio (gratuito) como primário, OpenRouter como fallback
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Gemini API Key</Label>
                <PasswordInput id="gemini" value={config.gemini_api_key} onChange={(v) => update("gemini_api_key", v)} />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Obtenha em aistudio.google.com — grátis com limites generosos
                </p>
              </div>
              <div>
                <Label className="text-xs">Modelo Primário</Label>
                <Input
                  value={config.ai_model_primary}
                  onChange={(e) => update("ai_model_primary", e.target.value)}
                  className="surface-high border-0 font-mono text-xs"
                />
              </div>
              <hr />
              <div>
                <Label className="text-xs">OpenRouter API Key (fallback)</Label>
                <PasswordInput id="openrouter" value={config.openrouter_api_key} onChange={(v) => update("openrouter_api_key", v)} />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Usado quando o Gemini falha. Modelos gratuitos disponíveis.
                </p>
              </div>
              <div>
                <Label className="text-xs">Modelo Fallback</Label>
                <Input
                  value={config.ai_model_fallback}
                  onChange={(e) => update("ai_model_fallback", e.target.value)}
                  className="surface-high border-0 font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card className="surface-low border-0">
            <CardHeader>
              <CardTitle className="text-sm">Configuração de Email</CardTitle>
              <p className="text-xs text-muted-foreground">
                Resend para envio de magic links e notificações
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Resend API Key</Label>
                <PasswordInput id="resend" value={config.resend_api_key} onChange={(v) => update("resend_api_key", v)} />
              </div>
              <div>
                <Label className="text-xs">Email Remetente</Label>
                <Input
                  value={config.smtp_from}
                  onChange={(e) => update("smtp_from", e.target.value)}
                  className="surface-high border-0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anúncios */}
        <TabsContent value="anuncios">
          <Card className="surface-low border-0">
            <CardHeader>
              <CardTitle className="text-sm">Google AdSense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Client ID do AdSense</Label>
                <Input
                  value={config.adsense_client_id}
                  onChange={(e) => update("adsense_client_id", e.target.value)}
                  className="surface-high border-0 font-mono text-xs"
                  placeholder="ca-pub-xxxxxxxxxx"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geral */}
        <TabsContent value="geral">
          <Card className="surface-low border-0">
            <CardHeader>
              <CardTitle className="text-sm">Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Nome do Site</Label>
                <Input
                  value={config.site_nome}
                  onChange={(e) => update("site_nome", e.target.value)}
                  className="surface-high border-0"
                />
              </div>
              <div>
                <Label className="text-xs">Descrição (SEO)</Label>
                <Input
                  value={config.site_descricao}
                  onChange={(e) => update("site_descricao", e.target.value)}
                  className="surface-high border-0"
                />
              </div>
              <div>
                <Label className="text-xs">Keywords (SEO)</Label>
                <Input
                  value={config.site_keywords}
                  onChange={(e) => update("site_keywords", e.target.value)}
                  className="surface-high border-0"
                />
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Modo Manutenção</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Bloqueia acesso público ao site
                  </p>
                </div>
                <Switch
                  checked={config.manutencao}
                  onCheckedChange={(v) => update("manutencao", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Registro Aberto</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Permitir novos cadastros
                  </p>
                </div>
                <Switch
                  checked={config.registro_aberto}
                  onCheckedChange={(v) => update("registro_aberto", v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
