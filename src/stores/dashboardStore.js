import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set) => ({
      missions: [],
      intel: [],
      documents: [],
      visitors: [],
      pendingOps: [],
      learningLogs: [],
      
      setMissions: (missions) => set({ missions }),
      setIntel: (intel) => set({ intel }),
      setDocuments: (documents) => set({ documents }),
      setVisitors: (visitors) => set({ visitors }),
      setPendingOps: (pendingOps) => set({ pendingOps }),
      setLearningLogs: (learningLogs) => set({ learningLogs }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ pendingOps: state.pendingOps, learningLogs: state.learningLogs }),
    }
  )
)
