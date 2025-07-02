import { usePaginationStore } from "@/stores/paginationStore"

const { pageIndex } = usePaginationStore()

const handleRowClick = useCallback(
  (matricula: string, atividade: number, matricula_responsavel_1: string) => {
    setAtividadeSelecionada(atividade)
    setMatriculaGestor(matricula_responsavel_1)

    router.push(
      `/funding/justificativa/${matricula}/${projetoSelecionado}/${subprojetoSelecionado}?page=${pageIndex}`
    )
  },
  [router, projetoSelecionado, subprojetoSelecionado, setAtividadeSelecionada, setMatriculaGestor, pageIndex]
)

Na rota de detalhes, recuperar o page da URL
No componente da rota / funding / justificativa / [matricula] / [projetoId] / [subprojetoId], utilize:

tsx
Copiar
Editar
"use client"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { usePaginationStore } from "@/stores/paginationStore"

export default function DetalhesJustificativa() {
  const searchParams = useSearchParams()
  const pageFromQuery = searchParams.get("page")
  const { setPageIndex } = usePaginationStore()

  useEffect(() => {
    if (pageFromQuery) {
      const pageIndex = parseInt(pageFromQuery, 10)
      if (!isNaN(pageIndex)) {
        setPageIndex(pageIndex)
      }
    }
  }, [pageFromQuery, setPageIndex])

  // ...restante da lógica do componente
}