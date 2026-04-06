"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Eye,
  MousePointerClick,
  Gamepad2,
  TrendingUp,
  Calendar,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Mock stats
const stats = [
  { label: "Usuários", value: "1.247", icon: Users, change: "+12%", color: "#6edba6" },
  { label: "Visitas Hoje", value: "3.891", icon: Eye, change: "+8%", color: "#4d8fd6" },
  { label: "Clicks Anúncios", value: "284", icon: MousePointerClick, change: "+23%", color: "#e9c349" },
  { label: "Jogos Gerados", value: "12.450", icon: Gamepad2, change: "+15%", color: "#cc5ec4" },
]

const visitasSemana = [
  { dia: "Seg", visitas: 2100, usuarios: 180 },
  { dia: "Ter", visitas: 2400, usuarios: 210 },
  { dia: "Qua", visitas: 1900, usuarios: 165 },
  { dia: "Qui", visitas: 3200, usuarios: 290 },
  { dia: "Sex", visitas: 2800, usuarios: 245 },
  { dia: "Sáb", visitas: 4100, usuarios: 380 },
  { dia: "Dom", visitas: 3891, usuarios: 342 },
]

const paginasPopulares = [
  { pagina: "/dashboard", visitas: 8420 },
  { pagina: "/gerador", visitas: 6230 },
  { pagina: "/heatmap", visitas: 3180 },
  { pagina: "/concursos", visitas: 2950 },
  { pagina: "/raio-x", visitas: 1870 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-secondary" />
          Dashboard Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do LotoLogic
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="surface-low border-0">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}15` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-medium">
                  {s.change}
                </span>
                <span className="text-xs text-muted-foreground">vs semana passada</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Visitas chart */}
        <Card className="surface-low border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Visitas e Usuários — Última Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitasSemana}>
                  <XAxis
                    dataKey="dia"
                    tick={{ fill: "#8a9a9e", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8a9a9e", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#182124",
                      border: "1px solid rgba(62, 73, 66, 0.2)",
                      borderRadius: "8px",
                      color: "#dae4e8",
                    }}
                  />
                  <Bar dataKey="visitas" fill="#6edba6" radius={[4, 4, 0, 0]} opacity={0.8} name="Visitas" />
                  <Bar dataKey="usuarios" fill="#e9c349" radius={[4, 4, 0, 0]} opacity={0.8} name="Novos Usuários" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Páginas populares */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Páginas Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginasPopulares.map((p, i) => (
                <div key={p.pagina} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4">
                    {i + 1}.
                  </span>
                  <span className="text-sm flex-1 font-mono text-foreground">
                    {p.pagina}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.visitas.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card className="surface-low border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/anuncios" className="btn-premium-gold text-xs px-4 py-2">
              Gerenciar Anúncios
            </a>
            <a href="/admin/usuarios" className="btn-premium text-xs px-4 py-2">
              Ver Usuários
            </a>
            <a href="/admin/config" className="px-4 py-2 rounded-xl text-xs font-medium surface-high text-foreground hover:bg-[#2d3639] transition-all">
              Configurações
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
