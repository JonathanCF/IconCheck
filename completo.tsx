"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, X, Loader2, Users, BriefcaseBusiness, CalendarPlus } from "lucide-react"
import BadgeStatus from "../badge-status"
import { TableSkeleton } from "../skeletons-manager"
import { formatMonths } from "@/utils/formatMonths"
import formatNames from "@/utils/formatName"
import { useFilterStore } from "@/stores/filterStore"
import { subprojectStore } from "@/stores/subprojectStore"
import { projectStore } from "@/stores/projectStore"
import { activityStore } from "@/stores/activityStore"
import { useRouter } from "next/navigation"
import { TooltipFunding } from "../tooltipFunding"
import { usePeriodStore } from "@/stores/usePeriodStore";
import { managerFundingStore } from "@/stores/managerFundingStore"
import { useFundingTableStore } from "@/stores/fundingTableStore"

interface Recurso {
  id: string;
  matricula_colaborador: string;
  cod_atividade: string
  responsavel: string;
  matricula_responsavel_1: string;
  colaborador: string;
  atividade: string;
  atividade_id: number
  inicioJustificativa: string;
  fimJustificativa: string;
  meses_atuacao: string[];
  status_justificativa_gestor: string;
  status_justificativa_funding: string;
}

interface NewDataTableFundingProps {
  data: Recurso[];
  isLoading: boolean;
}

export function NewDataTableFunding({ data, isLoading }: NewDataTableFundingProps) {
  const { id: cyclesId } = usePeriodStore();
  const { setAtividadeSelecionada } = activityStore()
  const { setMatriculaGestor } = managerFundingStore()
  const router = useRouter();
  const { projetoSelecionado, setProjetoSelecionado } = projectStore();
  const { subprojetoSelecionado, setSubprojetoSelecionado, idSubprojeto } = subprojectStore();

  // Usando o store Zustand para gerenciar estado
  const {
    // Filtros
    responsavelFilter,
    colaboradorFilter,
    atividadeFilter,
    periodoAtuacaoFilter,
    statusGestorFilter,
    statusFundingFilter,

    // Buscas
    responsavelSearch,
    colaboradorSearch,
    atividadeSearch,
    periodoSearch,
    statusGestorSearch,
    statusFundingSearch,

    // Paginação
    pagination,

    // Setters
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
    setPagination,
    clearAllFilters,
  } = useFundingTableStore();

  const [filteredData, setFilteredData] = useState<Recurso[]>([])

  const handleRowClick = useCallback(
    (matricula: string, atividade: number, matricula_responsavel_1: string) => {
      setAtividadeSelecionada(atividade);
      setMatriculaGestor(matricula_responsavel_1);
      router.push(`/funding/justificativa/${matricula}/${projetoSelecionado}/${subprojetoSelecionado}`);
    },
    [router, projetoSelecionado, subprojetoSelecionado, setAtividadeSelecionada, setMatriculaGestor]
  );

  // Aplicar filtros aos dados
  useEffect(() => {
    if (!data) return;

    let result = [...data];

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
        periodoAtuacaoFilter.some(month => item.meses_atuacao.includes(month))
    }

    if (statusGestorFilter.length > 0) {
      result = result.filter((item) => statusGestorFilter.includes(item.status_justificativa_gestor))
    }

    if (statusFundingFilter.length > 0) {
      result = result.filter((item) => statusFundingFilter.includes(item.status_justificativa_funding))
    }

    setFilteredData(result)
    setPagination({ ...pagination, pageIndex: 0 })
  }, [
    data,
    responsavelFilter,
    colaboradorFilter,
    atividadeFilter,
    periodoAtuacaoFilter,
    statusGestorFilter,
    statusFundingFilter,
    pagination,
    setPagination,
  ])

  // Inicializar dados filtrados
  useEffect(() => {
    if (data) {
      setFilteredData(data)
    }
  }, [data])

  // Dados paginados
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredData.slice(start, end)
  }, [filteredData, pagination])

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredData.length / pagination.pageSize)
  const currentPage = pagination.pageIndex + 1

  // Números das páginas para exibição
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

  // Controles de navegação
  const canPreviousPage = pagination.pageIndex > 0
  const canNextPage = pagination.pageIndex < totalPages - 1

  // Opções para os dropdowns de filtro
  const responsaveis = data ? Array.from(new Set(data.map((item) => item.responsavel))) : []
  const colaboradores = data ? Array.from(new Set(data.map((item) => item.colaborador))) : []
  const atividades = data ? Array.from(new Set(data.map((item) => item.atividade))) : []
  const mesesAtuacaoOptions = data ? Array.from(new Set(data.flatMap(item => item.meses_atuacao))) : []
  const statusGestorOptions = Array.from(new Set(data?.map(item => item.status_justificativa_gestor) || []))
  const statusFundingOptions = Array.from(new Set(data?.map(item => item.status_justificativa_funding) || []))

  // Filtros para os dropdowns
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

  // Limpar filtros quando o ciclo mudar
  useEffect(() => {
    clearAllFilters()
  }, [cyclesId, clearAllFilters])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando dados...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4" >
      <div className="flex justify-between">
        <div className="flex w-full flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="flex items-center gap-1 h-9">
              <X className="h-4 w-4" /> Limpar filtros
            </Button>

            {responsavelFilter.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 h-9 text-rd-gray-800">
                Gestores: {responsavelFilter.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setResponsavelFilter([])} />
              </Badge>
            )}

            {colaboradorFilter.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 h-9 text-rd-gray-800">
                Colaboradores: {colaboradorFilter.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setColaboradorFilter([])} />
              </Badge>
            )}

            {atividadeFilter.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 h-9 text-rd-gray-800">
                Atividades: {atividadeFilter.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setAtividadeFilter([])} />
              </Badge>
            )}

            {periodoAtuacaoFilter.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 h-9 text-rd-gray-800">
                Períodos: {periodoAtuacaoFilter.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setPeriodoAtuacaoFilter([])} />
              </Badge>
            )}

            {statusGestorFilter.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 h-9 text-rd-gray-800">
                Status Gestor: {statusGestorFilter.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusGestorFilter([])} />
              </Badge>
            )}

            {statusFundingFilter.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 h-9 text-rd-gray-800">
                Status Funding: {statusFundingFilter.length}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFundingFilter([])} />
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="bg-rd-white rounded-md overflow-y-auto">
        <div className="rounded-md border ">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-[rgb(243,244,246)]">
                <TableHead className="w-[250px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center py-2 text-rd-gray-800">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Gestor</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-rd-gray-800">
                          <Filter className="h-3 w-3 " />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[300px]">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Pesquisar colaborador..."
                              value={responsavelSearch}
                              onChange={(e) => setResponsavelSearch(e.target.value)}
                              className="pl-8 h-8 placeholder:text-rd-gray-800"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredResponsaveis.length > 0 ? (
                            filteredResponsaveis.map((responsavel) => (
                              <DropdownMenuCheckboxItem
                                key={responsavel}
                                className="text-rd-gray-800"
                                checked={responsavelFilter.includes(responsavel)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setResponsavelFilter([...responsavelFilter, responsavel])
                                  } else {
                                    setResponsavelFilter(responsavelFilter.filter((item) => item !== responsavel))
                                  }
                                }}
                              >
                                {formatNames(responsavel)}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">Nenhum colaborador encontrado</div>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                <TableHead className="w-[250px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center py-2 text-rd-gray-800">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Colaborador</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-rd-gray-800 focus-visible:ring-0">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[300px]">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Pesquisar colaborador..."
                              value={colaboradorSearch}
                              onChange={(e) => setColaboradorSearch(e.target.value)}
                              className="pl-8 h-8 placeholder:text-rd-gray-800"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredColaboradores.length > 0 ? (
                            filteredColaboradores.map((colaborador) => (
                              <DropdownMenuCheckboxItem
                                key={colaborador}
                                className="text-rd-gray-800"
                                checked={colaboradorFilter.includes(colaborador)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setColaboradorFilter([...colaboradorFilter, colaborador])
                                  } else {
                                    setColaboradorFilter(colaboradorFilter.filter((item) => item !== colaborador))
                                  }
                                }}
                              >
                                {formatNames(colaborador)}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">Nenhum colaborador encontrado</div>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                <TableHead className="w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center py-2 text-rd-gray-800">
                      <BriefcaseBusiness className="mr-2 h-4 w-4" />
                      <span>Atividade</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-rd-gray-800 focus-visible:ring-0">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[400px]">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground text-rd-gray-800" />
                            <Input
                              placeholder="Pesquisar atividade..."
                              value={atividadeSearch}
                              onChange={(e) => setAtividadeSearch(e.target.value)}
                              className="pl-8 h-8 text-rd-gray-800 placeholder:text-rd-gray-800"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredAtividades.length > 0 ? (
                            filteredAtividades.map((atividade) => (
                              <DropdownMenuCheckboxItem
                                key={atividade}
                                className="text-rd-gray-800"
                                checked={atividadeFilter.includes(atividade)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAtividadeFilter([...atividadeFilter, atividade])
                                  } else {
                                    setAtividadeFilter(atividadeFilter.filter((item) => item !== atividade))
                                  }
                                }}
                              >
                                {formatNames(atividade)}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">Nenhuma atividade encontrada</div>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                <TableHead className="w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center  text-rd-gray-800">
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      <span>Período de Atuação</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-rd-gray-800 focus-visible:ring-0">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[250px] ">
                        <div className="p-2 border-b">
                          <div className="relative ">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground text-rd-gray-800" />
                            <Input
                              placeholder="Pesquisar período..."
                              value={periodoSearch}
                              onChange={(e) => setPeriodoSearch(e.target.value)}
                              className="pl-8 h-8 text-rd-gray-800 placeholder:text-rd-gray-800"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredMesesAtuacao.length > 0 ? (
                            filteredMesesAtuacao.map((mes) => (
                              <DropdownMenuCheckboxItem
                                key={mes}
                                className="text-rd-gray-800"
                                checked={periodoAtuacaoFilter.includes(mes)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setPeriodoAtuacaoFilter([...periodoAtuacaoFilter, mes])
                                  } else {
                                    setPeriodoAtuacaoFilter(periodoAtuacaoFilter.filter((item) => item !== mes))
                                  }
                                }}
                              >
                                {formatMonths([mes])}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              Nenhum período encontrado
                            </div>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                <TableHead className="w-[150px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-rd-gray-800">
                      <span>Status Gestor</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-rd-gray-800 focus-visible:ring-0">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px]">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground text-rd-gray-800" />
                            <Input
                              placeholder="Pesquisar status..."
                              value={statusGestorSearch}
                              onChange={(e) => setStatusGestorSearch(e.target.value)}
                              className="pl-8 h-8 text-rd-gray-800 placeholder:text-rd-gray-800"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredStatusGestor.length > 0 ? (
                            filteredStatusGestor.map((status) => (
                              <DropdownMenuCheckboxItem
                                key={status}
                                className="text-rd-gray-800"
                                checked={statusGestorFilter.includes(status)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setStatusGestorFilter([...statusGestorFilter, status])
                                  } else {
                                    setStatusGestorFilter(statusGestorFilter.filter((item) => item !== status))
                                  }
                                }}
                              >
                                {formatNames(status)}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">Nenhum status encontrado</div>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>

                <TableHead className="w-[150px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-rd-gray-800">
                      <span>Status Funding</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-rd-gray-800 focus-visible:ring-0">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px]">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground text-rd-gray-800" />
                            <Input
                              placeholder="Pesquisar status..."
                              value={statusFundingSearch}
                              onChange={(e) => setStatusFundingSearch(e.target.value)}
                              className="pl-8 h-8 text-rd-gray-800 placeholder:text-rd-gray-800"
                            />
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredStatusFunding.length > 0 ? (
                            filteredStatusFunding.map((status) => (
                              <DropdownMenuCheckboxItem
                                key={status}
                                className="text-rd-gray-800"
                                checked={statusFundingFilter.includes(status)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setStatusFundingFilter([...statusFundingFilter, status])
                                  } else {
                                    setStatusFundingFilter(statusFundingFilter.filter((item) => item !== status))
                                  }
                                }}
                              >
                                {formatNames(status)}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">Nenhum status encontrado</div>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={3} columns={5} />
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(row.matricula_colaborador, row.atividade_id, row.matricula_responsavel_1)}
                  >
                    <TableCell>{formatNames(row.responsavel)}</TableCell>
                    <TableCell>{formatNames(row.colaborador)}</TableCell>
                    <TableCell>
                      <TooltipFunding text={formatNames(row.atividade)} />
                    </TableCell>
                    <TableCell>
                      <TooltipFunding text={formatMonths(row.meses_atuacao)} />
                    </TableCell>
                    <TableCell>
                      <BadgeStatus status={row.status_justificativa_gestor} />
                    </TableCell>
                    <TableCell>
                      <BadgeStatus status={row.status_justificativa_funding} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4 px-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando <strong>{paginatedData.length}</strong> de <strong>{filteredData.length}</strong> registros
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
              disabled={!canPreviousPage}
              className="text-sm font-medium"
            >
              Anterior
            </Button>

            {pageNumbers.map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  className={currentPage === page ? 'bg-gray-800 text-white' : ''}
                  onClick={() => setPagination({ ...pagination, pageIndex: page - 1 })}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-500">
                  ...
                </span>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
              disabled={!canNextPage}
              className="text-sm font-medium"
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}