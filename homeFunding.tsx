export default function HomeFunding() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const router = useRouter();

  const { areaSelecionada, setAreaSelecionada } = areaStore();
  const { projetoSelecionado, idProjeto, setProjetoSelecionado } = projectStore();
  const { subprojetoSelecionado, setSubprojetoSelecionado, idSubprojeto } = subprojectStore();
  const { globalFilter, setGlobalFilter } = useFilterStore()
  const { dataInicio, dataFim, setPeriod, id: cyclesId, clearPeriod, setDefaultPeriod } = usePeriodStore();

  const [projetoSelecionadoName, setProjetoSelecionadoName] = useState<string>("");
  const { periodoSelecionado, setPeriodoSelecionado } = usePeriodStore()
  const { idSubprojeto: subprojetoId } = subprojectStore();
  const { resetPagination } = usePaginationStore()

  const {
    data: projetosData,
    isLoading: projetosLoading,
    error: projetosError,
  } = useQuery({
    queryKey: ["projetosFunding"],
    queryFn: () => listProjectsOfFunding(),
  });

  const projetos = projetosData?.map((projeto: any) => ({
    label: projeto.nome_projeto,
    value: projeto.codigo_projeto,
  })) || [];

  const {
    data: subProjetosData,
    isLoading: subProjetosLoading,
    error: subProjetosError,
  } = useQuery({
    queryKey: ["subProjetosFunding", projetoSelecionado],
    queryFn: () => listSubprojectsOfFunding(idProjeto),
    enabled: !!projetoSelecionado,
  });

  const subProjetos = subProjetosData?.map((subproj: any) => ({
    label: subproj.nome_subprojeto,
    value: subproj.codigo_subprojeto,
  })) || [];

  const { data: periodsData, isLoading: periodDateLoading } = useQuery({
    queryKey: ["periodosFunding", subprojetoSelecionado],
    queryFn: () => listPeriodsFunding(idSubprojeto),
    enabled: !!subprojetoSelecionado
  });

  const getFormattedPeriods = () => {
    return (periodsData || []).map((periodo: any) => {
      return {
        label: formatPeriod(periodo.inicioJustificativa, periodo.fimJustificativa),
        value: `${periodo.inicioJustificativa}|${periodo.fimJustificativa}|${periodo.id}|${periodo.periodoId}`,
        ativo: periodo.ativo
      };
    });
  };

  // useEffect para limpar período ao sair da página (exceto para página de detalhes)
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Se não está indo para página de detalhes, limpa o período
      if (!url.includes('/funding/justificativa/')) {
        setPeriodoSelecionado("");
        clearPeriod();
      }
    };

    // Escuta mudanças de rota
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events, setPeriodoSelecionado, clearPeriod]);

  // useEffect para inicialização inicial (quando app inicia)
  useEffect(() => {
    if (!cyclesId && periodsData && periodsData.length > 0) {
      setDefaultPeriod();
    }
  }, [cyclesId, periodsData, setDefaultPeriod]);

  // useEffect para atualizar período quando periodsData muda (mudança de subprojeto)
  useEffect(() => {
    if (periodsData && periodsData.length > 0) {
      const formattedPeriods = getFormattedPeriods();

      // Verifica se já existe um período selecionado válido
      const periodoValido = formattedPeriods.find(p => p.value === periodoSelecionado);

      // Só seleciona automaticamente se não há período válido selecionado
      if (!periodoValido) {
        const periodoAtivo = formattedPeriods.find(p => p.ativo);
        const primeiroPeriodo = periodoAtivo || formattedPeriods[0];

        if (primeiroPeriodo?.value) {
          const [inicio, fim, id, periodoId] = primeiroPeriodo.value.split("|");
          setPeriodoSelecionado(primeiroPeriodo.value);
          setPeriod(inicio, fim, id, periodoId);
        }
      }
    } else if (periodsData && periodsData.length === 0) {
      // Se não há dados, limpa o período
      setPeriodoSelecionado("");
      clearPeriod();
    }
  }, [periodsData, periodoSelecionado]); // Volta a incluir periodoSelecionado para validação

  const handleProjetoChange = (codigoProjeto: string) => {
    const projetoAtual = projetosData?.find(
      (projeto: any) => projeto.codigo_projeto === codigoProjeto
    );

    if (projetoAtual) {
      setProjetoSelecionado(codigoProjeto, projetoAtual?.id_projeto || "");
      setProjetoSelecionadoName(projetoAtual.nome_projeto);
      setSubprojetoSelecionado("", "");
      // Não limpa o período aqui - deixa o useEffect gerenciar
    }
  };

  const handleSubprojetoChange = (codigoSubprojeto: string) => {
    const subprojetoSelecionadoObj = subProjetosData?.find(
      (subproj: any) => subproj.codigo_subprojeto === codigoSubprojeto
    );

    if (subprojetoSelecionadoObj) {
      setSubprojetoSelecionado(codigoSubprojeto, subprojetoSelecionadoObj?.id_subprojeto || "");
      // Não limpa o período aqui - deixa o useEffect gerenciar
    }
  };

  // Resto do componente...
  return (
    <div>
      {/* Seus componentes aqui */}
      <div className="mx-6">
        <NewFundingTable />
      </div>
    </div>
  );
}