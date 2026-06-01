import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      // Pro auth (Interface 2)
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // Ops auth (Interface 3)
      opsToken: null,
      isOpsAuthenticated: false,

      // Pro login — email/password users
      login: (userData, token, refreshToken) =>
        set({ user: userData, token, refreshToken, isAuthenticated: true }),

      // Ops login — passphrase-based, stores its own JWT
      opsLogin: (token) =>
        set({ opsToken: token, isOpsAuthenticated: true }),

      // Full logout — clears everything
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          opsToken: null,
          isOpsAuthenticated: false,
        }),

      // Pro-only logout (preserves ops session if active)
      proLogout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'auth-storage' }
  )
)