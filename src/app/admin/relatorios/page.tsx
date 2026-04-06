"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BarChart3, Users, MousePointerClick, Globe } from "lucide-react"

const visitasMes = Array.from({ length: 30 }, (_, i) => ({
  dia: `${i + 1}`,
  visitas: Math.floor(1500 + Math.random() * 3000),
  unicos: Math.floor(500 + Math.random() * 1000),
}))

const loteriasUso = [
  { nome: "Mega-Sena", value: 42, color: "#209869" },
  { nome: "Lotofácil", value: 28, color: "#930089" },
  { nome: "Quina", value: 12, color: "#260085" },
  { nome: "Lotomania", value: 8, color: "#f78100" },
  { nome: "Outras", value: 10, color: "#8a9a9e" },
]

const referrers = [
  { fonte: "Google", visitas: 12430 },
  { fonte: "Direto", visitas: 8920 },
  { fonte: "YouTube", visitas: 3100 },
  { fonte: "Instagram", visitas: 2450 },
  { fonte: "WhatsApp", visitas: 1870 },
  { fonte: "Facebook", visitas: 980 },
]

const dispositivos = [
  { nome: "Mobile", value: 62, color: "#6edba6" },
  { nome: "Desktop", value: 34, color: "#e9c349" },
  { nome: "Tablet", value: 4, color: "#4d8fd6" },
]

const tooltipStyle = {
  contentStyle: {
    background: "#182124",
    border: "1px solid rgba(62, 73, 66, 0.2)",
    borderRadius: "8px",
    color: "#dae4e8",
    fontSize: "12px",
  },
}

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Relatórios
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analytics detalhado de visitas, uso e engajamento
        </p>
      </div>

      {/* Visitas do mês */}
      <Card className="surface-low border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Visitas do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitasMes}>
                <XAxis dataKey="dia" tick={{ fill: "#8a9a9e", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8a9a9e", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="visitas" stroke="#6edba6" strokeWidth={2} dot={false} name="Visitas" />
                <Line type="monotone" dataKey="unicos" stroke="#e9c349" strokeWidth={2} dot={false} name="Únicos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grid 2x2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Loterias mais usadas */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loterias Mais Usadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={loteriasUso} dataKey="value" nameKey="nome" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {loteriasUso.map((e) => (
                      <Cell key={e.nome} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {loteriasUso.map((l) => (
                <span key={l.nome} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  {l.nome} ({l.value}%)
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dispositivos */}
        <Card className="surface-low border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dispositivos} dataKey="value" nameKey="nome" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {dispositivos.map((e) => (
                      <Cell key={e.nome} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {dispositivos.map((d) => (
                <span key={d.nome} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  {d.nome} ({d.value}%)
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrers */}
      <Card className="surface-low border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Fontes de Tráfego</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referrers} layout="vertical">
                <XAxis type="number" tick={{ fill: "#8a9a9e", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="fonte" tick={{ fill: "#8a9a9e", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="visitas" fill="#6edba6" radius={[0, 4, 4, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
