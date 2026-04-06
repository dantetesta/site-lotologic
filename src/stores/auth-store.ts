import { create } from "zustand"
import type { UserProfile } from "@/types/user"

interface AuthState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
