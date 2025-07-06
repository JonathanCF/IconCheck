export function NewDataTableFunding({ data, isLoading }: NewDataTableFundingProps) {
  const { id: cyclesId } = usePeriodStore();
  const { setAtividadeSelecionada } = activityStore()
  const { setMatriculaGestor } = managerFundingStore()
  const router = useRouter();

  const {
    responsavelFilter,
    colaboradorFilter,
    atividadeFilter,
    periodoAtuacaoFilter,
    statusGestorFilter,
    statusFundingFilter,
    setResponsavelFilter,
    setColaboradorFilter,
    setAtividadeFilter,
    setPeriodoAtuacaoFilter,
    setStatusGestorFilter,
    setStatusFundingFilter,
    clearAllFilters
  } = useFilterStore();

  const [filteredData, setFilteredData] = useState<Recurso[]>(data || [])

  const [responsavelSearch, setResponsavelSearch] = useState<string>("")
  const [colaboradorSearch, setColaboradorSearch] = useState<string>("")
  const [atividadeSearch, setAtividadeSearch] = useState<string>("")
  const [periodoSearch, setPeriodoSearch] = useState<string>("")
  const [statusGestorSearch, setStatusGestorSearch] = useState<string>("")
  const [statusFundingSearch, setStatusFundingSearch] = useState<string>("")

  const { projetoSelecionado, setProjetoSelecionado } = projectStore();
  const { subprojetoSelecionado, setSubprojetoSelecionado, idSubprojeto } = subprojectStore();

  const {
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    resetPagination,
  } = usePaginationStore()

  // useEffect para limpar filtros quando projeto ou subprojeto mudarem
  useEffect(() => {
    clearAllFilters();

    // Também limpar os estados locais de busca
    setResponsavelSearch("");
    setColaboradorSearch("");
    setAtividadeSearch("");
    setPeriodoSearch("");
    setStatusGestorSearch("");
    setStatusFundingSearch("");
  }, [projetoSelecionado, subprojetoSelecionado, clearAllFilters]);

  const handleRowClick = useCallback(
    (matricula: string, atividade: number, matricula_responsavel_1: string) => {
      setAtividadeSelecionada(atividade);
      setMatriculaGestor(matricula_responsavel_1);
      router.push(`/funding/justificativa/${matricula}/${projetoSelecionado}/${subprojetoSelecionado}/?page=${pageIndex}`);
    },
    [router, projetoSelecionado, subprojetoSelecionado, setAtividadeSelecionada, setMatriculaGestor, pageIndex]
  );

  // Atualizar filteredData quando data ou filtros mudarem
  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      return;
    }

    let result = [...data];

    // Aplicar filtros
    if (responsavelFilter.length > 0) {
      result = result.filter((item) => responsavelFilter.includes(item.responsavel))
    }

    if (colaboradorFilter.length > 0) {
      result = result.filter((item) => colaboradorFilter.includes(item.colaborador))
    }

    if (atividadeFilter.length > 0) {
      result = result.filter((item) => atividadeFilter.includes(item.atividade))
    }

    if (periodoAtuacaoFilter.length > 0) {
      result = result.filter((item) =>
        periodoAtuacaoFilter.some(month => item.mes_atuacao.includes(month))
    }

    if (statusGestorFilter.length > 0) {
      result = result.filter((item) => statusGestorFilter.includes(item.status_justificativa_gestor))
    }

    if (statusFundingFilter.length > 0) {
      result = result.filter((item) => statusFundingFilter.includes(item.status_justificativa_funding))
    }

    setFilteredData(result);
    resetPagination(); // Resetar paginação quando filtros mudarem
  }, [
    data,
    responsavelFilter,
    colaboradorFilter,
    atividadeFilter,
    periodoAtuacaoFilter,
    statusGestorFilter,
    statusFundingFilter,
    resetPagination
  ])

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize
    const end = start + pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pageIndex, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const currentPage = pageIndex + 1

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', currentPage, '...', totalPages)
    }

    return pages
  }, [currentPage, totalPages])

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < totalPages - 1

  const responsaveis = data ? Array.from(new Set(data.map((item) => item.responsavel))) : []
  const colaboradores = data ? Array.from(new Set(data.map((item) => item.colaborador))) : []
  const atividades = data ? Array.from(new Set(data.map((item) => item.atividade))) : []
  const mesesAtuacaoOptions = data ? Array.from(new Set(data.flatMap(item => item.mes_atuacao))) : []
  const statusGestorOptions = Array.from(new Set(data?.map(item => item.status_justificativa_gestor) || []))
  const statusFundingOptions = Array.from(new Set(data?.map(item => item.status_justificativa_funding) || []))

  const filteredResponsaveis = responsaveis.filter((responsavel) =>
    responsavel && typeof responsavel === 'string' && responsavel.toLowerCase().includes(responsavelSearch.toLowerCase())
  )

  const filteredColaboradores = colaboradores.filter((colaborador) =>
    colaborador && typeof colaborador === 'string' && colaborador.toLowerCase().includes(colaboradorSearch.toLowerCase())
  )

  const filteredAtividades = atividades.filter((atividade) =>
    atividade && typeof atividade === 'string' && atividade.toLowerCase().includes(atividadeSearch.toLowerCase())
  )

  const filteredMesesAtuacao = mesesAtuacaoOptions.filter((mes) =>
    mes.toLowerCase().includes(periodoSearch.toLowerCase())
  )

  const filteredStatusGestor = statusGestorOptions.filter((status) =>
    status.toLowerCase().includes(statusGestorSearch.toLowerCase()),
  )
  const filteredStatusFunding = statusFundingOptions.filter((status) =>
    status.toLowerCase().includes(statusFundingSearch.toLowerCase()),
  )

  // ... resto do componente (render, etc.)
}