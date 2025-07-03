export function NewDataTableFunding({ data, isLoading }: NewDataTableFundingProps) {
  // Outros stores e hooks
  const { id: cyclesId } = usePeriodStore();
  const { setAtividadeSelecionada } = activityStore();
  const { setMatriculaGestor } = managerFundingStore();
  const router = useRouter();

  // Seletores otimizados do filterStore
  const {
    responsavelFilter,
    colaboradorFilter,
    atividadeFilter,
    periodoAtuacaoFilter,
    statusGestorFilter,
    statusFundingFilter,
    responsavelSearch,
    colaboradorSearch,
    atividadeSearch,
    periodoSearch,
    statusGestorSearch,
    statusFundingSearch,
    setResponsavelFilter,
    setColaboradorFilter,
    setAtividadeFilter,
    setPeriodoAtuacaoFilter,
    setStatusGestorFilter,
    setStatusFundingFilter,
    setResponsavelSearch,
    setColaboradorSearch,
    setAtividadeSearch,
    setPeriodoSearch,
    setStatusGestorSearch,
    setStatusFundingSearch,
    clearAllFilters,
  } = useFilterStore();

  // Estados locais do componente
  const [filteredData, setFilteredData] = useState<Recurso[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Efeito para aplicar filtros
  useEffect(() => {
    if (!data) return;

    let result = [...data];

    if (responsavelFilter.length > 0) {
      result = result.filter((item) => responsavelFilter.includes(item.responsavel));
    }

    if (colaboradorFilter.length > 0) {
      result = result.filter((item) => colaboradorFilter.includes(item.colaborador));
    }

    if (atividadeFilter.length > 0) {
      result = result.filter((item) => atividadeFilter.includes(item.atividade));
    }

    if (periodoAtuacaoFilter.length > 0) {
      result = result.filter((item) =>
        periodoAtuacaoFilter.some(month => item.meses_atuacao.includes(month))
      );
    }

    if (statusGestorFilter.length > 0) {
      result = result.filter((item) => statusGestorFilter.includes(item.status_justificativa_gestor));
    }

    if (statusFundingFilter.length > 0) {
      result = result.filter((item) => statusFundingFilter.includes(item.status_justificativa_funding));
    }

    setFilteredData(result);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [
    data,
    responsavelFilter,
    colaboradorFilter,
    atividadeFilter,
    periodoAtuacaoFilter,
    statusGestorFilter,
    statusFundingFilter,
  ]);

  // Efeito para limpar filtros ao mudar ciclo
  useEffect(() => {
    clearAllFilters();
  }, [cyclesId, clearAllFilters]);

  // ... (restante do componente permanece igual)

  return (
    <div className="space-y-4">
      {/* Código JSX existente */}
      {/* Todos os handlers agora usam as funções do store */}
      <DropdownMenuCheckboxItem
        key={responsavel}
        checked={responsavelFilter.includes(responsavel)}
        onCheckedChange={(checked) => {
          if (checked) {
            setResponsavelFilter([...responsavelFilter, responsavel]);
          } else {
            setResponsavelFilter(responsavelFilter.filter((item) => item !== responsavel));
          }
        }}
      >
        {formatNames(responsavel)}
      </DropdownMenuCheckboxItem>

      {/* Padrão repetido para outros filtros */}
    </div>
  );
}