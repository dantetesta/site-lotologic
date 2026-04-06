"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Megaphone, Plus, Eye, MousePointerClick, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Anuncio } from "@/types/lottery"

const mockAnuncios: Anuncio[] = [
  {
    id: "1",
    tipo: "adsense",
    nome: "Banner Sidebar Top",
    posicao: "sidebar",
    codigo: '<ins class="adsbygoogle" data-ad-client="ca-pub-xxx" data-ad-slot="123"></ins>',
    ativo: true,
    impressoes: 45230,
    clicks: 1284,
    ordem: 1,
  },
  {
    id: "2",
    tipo: "vip",
    nome: "Curso Loteria Premium",
    posicao: "inline",
    urlDestino: "https://exemplo.com/curso",
    imagemUrl: "https://placehold.co/728x90/141d20/6edba6?text=An%C3%BAncio+VIP",
    ativo: true,
    impressoes: 18920,
    clicks: 892,
    ordem: 2,
  },
  {
    id: "3",
    tipo: "adsense",
    nome: "Banner Footer",
    posicao: "footer",
    codigo: '<ins class="adsbygoogle" data-ad-client="ca-pub-xxx" data-ad-slot="456"></ins>',
    ativo: false,
    impressoes: 12100,
    clicks: 340,
    ordem: 3,
  },
]

export default function AnunciosPage() {
  const [anuncios, setAnuncios] = useState(mockAnuncios)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<Anuncio | null>(null)

  const [form, setForm] = useState<{
    tipo: "adsense" | "vip"
    nome: string
    posicao: "sidebar" | "header" | "inline" | "footer" | "modal"
    codigo: string
    urlDestino: string
    imagemUrl: string
  }>({
    tipo: "vip",
    nome: "",
    posicao: "sidebar",
    codigo: "",
    urlDestino: "",
    imagemUrl: "",
  })

  const resetForm = () => {
    setForm({ tipo: "vip", nome: "", posicao: "sidebar", codigo: "", urlDestino: "", imagemUrl: "" })
    setEditando(null)
  }

  const salvar = () => {
    if (!form.nome) {
      toast.error("Nome é obrigatório")
      return
    }

    if (editando) {
      setAnuncios((prev) =>
        prev.map((a) => (a.id === editando.id ? { ...a, ...form } : a))
      )
      toast.success("Anúncio atualizado!")
    } else {
      const novo: Anuncio = {
        id: crypto.randomUUID(),
        ...form,
        ativo: true,
        impressoes: 0,
        clicks: 0,
        ordem: anuncios.length + 1,
      }
      setAnuncios((prev) => [...prev, novo])
      toast.success("Anúncio criado!")
    }
    setDialogOpen(false)
    resetForm()
  }

  const toggleAtivo = (id: string) => {
    setAnuncios((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a))
    )
  }

  const remover = (id: string) => {
    setAnuncios((prev) => prev.filter((a) => a.id !== id))
    toast.success("Anúncio removido")
  }

  const ctr = (imp: number, cli: number) =>
    imp > 0 ? ((cli / imp) * 100).toFixed(2) : "0.00"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-secondary" />
            Anúncios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie AdSense e anúncios VIP
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm() }}>
          <DialogTrigger>
            <span className="btn-premium-gold text-sm flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Novo Anúncio
            </span>
          </DialogTrigger>
          <DialogContent className="surface-mid border-border/20 max-w-lg">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Novo"} Anúncio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as "adsense" | "vip" })}>
                    <SelectTrigger className="surface-high border-0 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adsense">AdSense</SelectItem>
                      <SelectItem value="vip">VIP (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Posição</Label>
                  <Select value={form.posicao} onValueChange={(v) => setForm({ ...form, posicao: v as "sidebar" | "header" | "inline" | "footer" | "modal" })}>
                    <SelectTrigger className="surface-high border-0 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="modal">Modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="surface-high border-0 mt-1"
                  placeholder="Ex: Banner Sidebar Premium"
                />
              </div>
              {form.tipo === "adsense" ? (
                <div>
                  <Label className="text-xs">Código AdSense</Label>
                  <Textarea
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                    className="surface-high border-0 mt-1 font-mono text-xs"
                    rows={4}
                    placeholder="<ins class='adsbygoogle' ..."
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-xs">URL Destino</Label>
                    <Input
                      value={form.urlDestino}
                      onChange={(e) => setForm({ ...form, urlDestino: e.target.value })}
                      className="surface-high border-0 mt-1"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL da Imagem</Label>
                    <Input
                      value={form.imagemUrl}
                      onChange={(e) => setForm({ ...form, imagemUrl: e.target.value })}
                      className="surface-high border-0 mt-1"
                      placeholder="https://...imagem.jpg"
                    />
                  </div>
                </>
              )}
              <button onClick={salvar} className="btn-premium w-full">
                {editando ? "Salvar Alterações" : "Criar Anúncio"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de anúncios */}
      <div className="space-y-3">
        {anuncios.map((a) => (
          <Card key={a.id} className="surface-low border-0">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{a.nome}</span>
                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                      {a.tipo.toUpperCase()}
                    </Badge>
                    <Badge
                      className={`text-[10px] flex-shrink-0 ${
                        a.ativo ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {a.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Posição: {a.posicao}
                  </p>
                </div>

                {/* Métricas */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <Eye className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-0.5" />
                    <span className="font-medium">{a.impressoes.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <MousePointerClick className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-0.5" />
                    <span className="font-medium">{a.clicks.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground block mb-0.5">CTR</span>
                    <span className="font-medium text-secondary">{ctr(a.impressoes, a.clicks)}%</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1">
                  <Switch
                    checked={a.ativo}
                    onCheckedChange={() => toggleAtivo(a.id)}
                  />
                  <button
                    onClick={() => {
                      setEditando(a)
                      setForm({
                        tipo: a.tipo,
                        nome: a.nome,
                        posicao: a.posicao || "sidebar",
                        codigo: a.codigo || "",
                        urlDestino: a.urlDestino || "",
                        imagemUrl: a.imagemUrl || "",
                      })
                      setDialogOpen(true)
                    }}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remover(a.id)}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
