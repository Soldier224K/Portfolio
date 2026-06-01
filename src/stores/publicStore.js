import { create } from 'zustand'

export const usePublicStore = create((set) => ({
  projects: [],
  metrics: {
    githubCommitsThisWeek: 0,
    hoursCoded: 0,
    currentObsession: '...',
    status: 'building'
  },
  
  setProjects: (projects) => set({ projects }),
  setMetrics: (metrics) => set({ metrics }),
}))
