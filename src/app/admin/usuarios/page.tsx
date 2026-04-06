"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Search, Shield, Mail, Calendar } from "lucide-react"

const mockUsers = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i + 1}`,
  nome: [
    "João Silva",
    "Maria Santos",
    "Pedro Oliveira",
    "Ana Costa",
    "Carlos Lima",
    "Lucia Souza",
    "Roberto Alves",
    "Fernanda Dias",
    "Miguel Pereira",
    "Patricia Rocha",
  ][i % 10],
  email: `user${i + 1}@email.com`,
  isAdmin: i === 0,
  loteriaPrincipal: ["megasena", "lotofacil", "quina"][i % 3],
  jogos: Math.floor(Math.random() * 50),
  createdAt: new Date(Date.now() - Math.random() * 90 * 86400000)
    .toISOString()
    .split("T")[0],
}))

export default function UsuariosPage() {
  const [busca, setBusca] = useState("")

  const filtrados = busca
    ? mockUsers.filter(
        (u) =>
          u.nome.toLowerCase().includes(busca.toLowerCase()) ||
          u.email.toLowerCase().includes(busca.toLowerCase())
      )
    : mockUsers

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Usuários
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockUsers.length} usuários cadastrados
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9 surface-high border-0 h-10"
          />
        </div>
      </div>

      <Card className="surface-low border-0">
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/10 hover:bg-transparent">
                  <TableHead className="text-xs text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Email</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Loteria</TableHead>
                  <TableHead className="text-xs text-muted-foreground text-center">Jogos</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Cadastro</TableHead>
                  <TableHead className="text-xs text-muted-foreground">Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((u) => (
                  <TableRow key={u.id} className="border-border/5 hover:bg-accent/50">
                    <TableCell className="text-sm font-medium">{u.nome}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {u.loteriaPrincipal}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-primary font-medium">
                      {u.jogos}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {u.createdAt}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.isAdmin && (
                        <Badge className="bg-secondary/15 text-secondary text-[10px]">
                          <Shield className="w-2.5 h-2.5 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
