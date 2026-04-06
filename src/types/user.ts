export interface UserProfile {
  id: string
  nome?: string
  email: string
  loteriasFavoritas: string[]
  loteriaPrincipal: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsuarios: number
  usuariosHoje: number
  visitasHoje: number
  visitasMes: number
  clicksAnunciosHoje: number
  jogosGerados: number
  jogosSalvos: number
}
