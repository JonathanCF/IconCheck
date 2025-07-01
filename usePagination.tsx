Crie o store paginationStore.ts:
ts
Copiar
Editar
// stores/paginationStore.ts
import { create } from 'zustand'

interface PaginationState {
  pageIndex: number
  pageSize: number
  setPageIndex: (index: number) => void
  setPageSize: (size: number) => void
  resetPagination: () => void
}

export const usePaginationStore = create<PaginationState>((set) => ({
  pageIndex: 0,
  pageSize: 10,
  setPageIndex: (index) => set({ pageIndex: index }),
  setPageSize: (size) => set({ pageSize: size }),
  resetPagination: () => set({ pageIndex: 0 }),
}))