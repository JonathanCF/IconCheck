import { create } from "zustand"

interface FundingFiltersState {
  responsavel: string[]
  colaborador: string[]
  atividade: string[]
  periodo: string[]
  statusGestor: string[]
  statusFunding: string[]

  setResponsavel: (value: string[]) => void
  setColaborador: (value: string[]) => void
  setAtividade: (value: string[]) => void
  setPeriodo: (value: string[]) => void
  setStatusGestor: (value: string[]) => void
  setStatusFunding: (value: string[]) => void
  clearAll: () => void
}

export const useFundingFiltersStore = create<FundingFiltersState>((set) => ({
  responsavel: [],
  colaborador: [],
  atividade: [],
  periodo: [],
  statusGestor: [],
  statusFunding: [],

  setResponsavel: (value) => set({ responsavel: value }),
  setColaborador: (value) => set({ colaborador: value }),
  setAtividade: (value) => set({ atividade: value }),
  setPeriodo: (value) => set({ periodo: value }),
  setStatusGestor: (value) => set({ statusGestor: value }),
  setStatusFunding: (value) => set({ statusFunding: value }),

  clearAll: () =>
    set({
      responsavel: [],
      colaborador: [],
      atividade: [],
      periodo: [],
      statusGestor: [],
      statusFunding: [],
    }),
}))