import { create } from 'zustand';

interface FilterState {
  // Estados dos filtros
  responsavelFilter: string[];
  colaboradorFilter: string[];
  atividadeFilter: string[];
  periodoAtuacaoFilter: string[];
  statusGestorFilter: string[];
  statusFundingFilter: string[];

  // Estados das buscas
  responsavelSearch: string;
  colaboradorSearch: string;
  atividadeSearch: string;
  periodoSearch: string;
  statusGestorSearch: string;
  statusFundingSearch: string;

  // Ações para atualizar filtros
  setResponsavelFilter: (filter: string[]) => void;
  setColaboradorFilter: (filter: string[]) => void;
  setAtividadeFilter: (filter: string[]) => void;
  setPeriodoAtuacaoFilter: (filter: string[]) => void;
  setStatusGestorFilter: (filter: string[]) => void;
  setStatusFundingFilter: (filter: string[]) => void;

  // Ações para atualizar buscas
  setResponsavelSearch: (search: string) => void;
  setColaboradorSearch: (search: string) => void;
  setAtividadeSearch: (search: string) => void;
  setPeriodoSearch: (search: string) => void;
  setStatusGestorSearch: (search: string) => void;
  setStatusFundingSearch: (search: string) => void;

  // Ação para limpar todos os filtros
  clearAllFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Valores iniciais
  responsavelFilter: [],
  colaboradorFilter: [],
  atividadeFilter: [],
  periodoAtuacaoFilter: [],
  statusGestorFilter: [],
  statusFundingFilter: [],

  responsavelSearch: "",
  colaboradorSearch: "",
  atividadeSearch: "",
  periodoSearch: "",
  statusGestorSearch: "",
  statusFundingSearch: "",

  // Implementação das ações
  setResponsavelFilter: (filter) => set({ responsavelFilter: filter }),
  setColaboradorFilter: (filter) => set({ colaboradorFilter: filter }),
  setAtividadeFilter: (filter) => set({ atividadeFilter: filter }),
  setPeriodoAtuacaoFilter: (filter) => set({ periodoAtuacaoFilter: filter }),
  setStatusGestorFilter: (filter) => set({ statusGestorFilter: filter }),
  setStatusFundingFilter: (filter) => set({ statusFundingFilter: filter }),

  setResponsavelSearch: (search) => set({ responsavelSearch: search }),
  setColaboradorSearch: (search) => set({ colaboradorSearch: search }),
  setAtividadeSearch: (search) => set({ atividadeSearch: search }),
  setPeriodoSearch: (search) => set({ periodoSearch: search }),
  setStatusGestorSearch: (search) => set({ statusGestorSearch: search }),
  setStatusFundingSearch: (search) => set({ statusFundingSearch: search }),

  clearAllFilters: () => set({
    responsavelFilter: [],
    colaboradorFilter: [],
    atividadeFilter: [],
    periodoAtuacaoFilter: [],
    statusGestorFilter: [],
    statusFundingFilter: [],
    responsavelSearch: "",
    colaboradorSearch: "",
    atividadeSearch: "",
    periodoSearch: "",
    statusGestorSearch: "",
    statusFundingSearch: "",
  }),
}));