//No seu componente NewDataTableFunding, substitua o useState atual de paginação por:

import { usePaginationStore } from "@/stores/paginationStore"

const {
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  resetPagination,
} = usePaginationStore()

//Substitua o antigo useEffect de filtro + paginação por:

useEffect(() => {
  if (!data) return

  let result = [...data]

  if (responsavelFilter.length > 2) {
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
      periodoAtuacaoFilter.some((month) => item.meses_atuacao.includes(month))
    )
  }

  if (statusGestorFilter.length > 0) {
    result = result.filter((item) =>
      statusGestorFilter.includes(item.status_justificativa_gestor)
    )
  }

  if (statusFundingFilter.length > 0) {
    result = result.filter((item) =>
      statusFundingFilter.includes(item.status_justificativa_funding)
    )
  }

  setFilteredData(result)
  resetPagination()
}, [
  data,
  responsavelFilter,
  colaboradorFilter,
  atividadeFilter,
  periodoAtuacaoFilter,
  statusGestorFilter,
  statusFundingFilter,
])

//Atualize o cálculo da paginação:

const paginatedData = useMemo(() => {
  const start = pageIndex * pageSize
  const end = start + pageSize
  return filteredData.slice(start, end)
}, [filteredData, pageIndex, pageSize])

const totalPages = Math.ceil(filteredData.length / pageSize)
const currentPage = pageIndex + 1
const canPreviousPage = pageIndex > 0
const canNextPage = pageIndex < totalPages - 1

//Atualize o pageNumbers:

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


  //Renderização da paginação (no final do JSX):

  < Button
variant = "outline"
size = "sm"
onClick = {() => setPageIndex(pageIndex - 1)}
disabled = {!canPreviousPage}
>
  Anterior
</Button >

{
  pageNumbers.map((page, index) =>
    typeof page === 'number' ? (
      <Button
        key={index}
        variant={currentPage === page ? 'default' : 'outline'}
        size="sm"
        className={currentPage === page ? 'bg-gray-800 text-white' : ''}
        onClick={() => setPageIndex(page - 1)}
      >
        {page}
      </Button>
    ) : (
      <span key={index} className="px-2 text-gray-500">...</span>
    )
  )
}

  < Button
variant = "outline"
size = "sm"
onClick = {() => setPageIndex(pageIndex + 1)}
disabled = {!canNextPage}
>
  Próximo
</Button >

