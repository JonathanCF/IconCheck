2. Substituir os filtros locais pelos filtros do store
No componente NewDataTableFunding, substitua:

ts
Copiar
Editar
const [responsavelFilter, setResponsavelFilter] = useState<string[]>([])
por:

ts
Copiar
Editar
const {
  responsavel,
  colaborador,
  atividade,
  periodo,
  statusGestor,
  statusFunding,
  setResponsavel,
  setColaborador,
  setAtividade,
  setPeriodo,
  setStatusGestor,
  setStatusFunding,
  clearAll,
} = useFundingFiltersStore()
E onde você fazia setResponsavelFilter(...), troque por setResponsavel(...), etc.

3. Atualizar o filtro de dados para usar os valores da store
Na useEffect onde você filtra data, mude:

ts
Copiar
Editar
if (responsavel.length > 0) {
  result = result.filter((item) => responsavel.includes(item.responsavel))
}
Faça isso para todos os filtros(colaborador, atividade, periodo, etc.).

4. Atualizar clearAllFilters
Atualize para chamar clearAll() da store:

ts
Copiar
Editar
const clearAllFilters = () => {
  clearAll()
  setResponsavelSearch("")
  setColaboradorSearch("")
  setAtividadeSearch("")
  setPeriodoSearch("")
  setStatusGestorSearch("")
  setStatusFundingSearch("")
}
5.(Opcional) Resetar filtros ao mudar ciclo
Se você quiser limpar filtros ao mudar o ciclo, mantenha o clearAll() dentro do useEffect([cyclesId]).

