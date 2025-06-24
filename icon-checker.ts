icon-checker.tsx

"use client"

import { useQuery } from "@tanstack/react-query"
import { AlertCircle, Loader2 } from "lucide-react"

interface IconCheckerProps {
  userId: number
}

export function IconChecker({ userId }: IconCheckerProps) {
  const { data: checkResult, isLoading } = useQuery({
    queryKey: ["userCheck", userId],
    queryFn: () => checkUserData(userId),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  })

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  }

  // Se o array estiver vazio, mostra o ícone
  if (checkResult && checkResult.length === 0) {
    return <AlertCircle className="h-4 w-4 text-amber-500" title="Dados não encontrados" />
  }

  // Se o array não estiver vazio, não mostra nada
  return null
}

data-table.tsx

import { IconChecker } from "./icon-checker"

<TableCell>
  <div className="flex items-center gap-2">
    <span>{user.nome}</span>
    <IconChecker userId={user.id} />
  </div>
</TableCell>