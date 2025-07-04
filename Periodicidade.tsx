"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ArrowLeft, X } from "lucide-react"
import { useState } from "react"

export default function RegisterPeriods() {
  const periodicityOptions = [
    { label: "Mensal", value: "mensal" },
    { label: "Bimestral", value: "bimestral" },
    { label: "Trimestral", value: "trimestral" },
    { label: "Quadrimestral", value: "quadrimestral" },
    { label: "Semestral", value: "semestral" },
    { label: "Anual", value: "anual" },
  ]

  const [periodicities, setPeriodicities] = useState<string[]>([])
  const [selectedPeriodicity, setSelectedPeriodicity] = useState("")
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error" | "info"
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBack = () => {
    // Simular navegação de volta
    console.log("Navegando de volta para lista de periodicidades")
  }

  const handleAdd = () => {
    setMessage(null)

    if (!selectedPeriodicity) {
      setMessage({ text: "Selecione uma periodicidade.", type: "error" })
      return
    }

    if (periodicities.includes(selectedPeriodicity)) {
      setMessage({ text: "Periodicidade já adicionada.", type: "error" })
      return
    }

    setPeriodicities((prev) => [...prev, selectedPeriodicity])
    setSelectedPeriodicity("")
    setMessage({ text: "Periodicidade adicionada com sucesso.", type: "success" })
  }

  const handleRemove = (value: string) => {
    setPeriodicities((prev) => prev.filter((p) => p !== value))
    setMessage({ text: `Periodicidade ${value} removida`, type: "info" })
  }

  const handleSave = async () => {
    if (periodicities.length === 0) {
      setMessage({ text: "Adicione ao menos uma periodicidade antes de salvar.", type: "info" })
      return
    }

    setIsLoading(true)

    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage({ text: "Periodicidades salvas com sucesso!", type: "success" })
      setPeriodicities([])
      console.log("Periodicidades salvas:", periodicities)
    } catch (error) {
      setMessage({ text: "Erro ao salvar periodicidades.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setPeriodicities([])
    setMessage({ text: "Todas as periodicidades foram removidas", type: "info" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb simulado */}
      <div className="pt-8 px-8">
        <nav className="text-sm text-gray-600">
          <span>Admin</span> / <span>Periodicidade</span> / <span className="text-gray-900">Adicionar</span>
        </nav>
      </div>

      <div className="mx-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Header */}
          <header>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-teal-600">Adicionar Periodicidade</h2>
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Voltar</span>
              </Button>
            </div>
            <hr className="border-gray-200 w-full mt-6" />
          </header>

          {/* Main Content */}
          <main className="mt-10">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-teal-600 font-medium mb-6">
                Para começar, selecione o tipo de periodicidade desejado e clique no botão "+ Adicionar". Para
                finalizar, clique em "Salvar Período".
              </p>

              {/* Select Periodicity */}
              <div className="flex gap-4 items-end mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-800 mb-2 block">Tipo de periodicidade</label>
                  <Select value={selectedPeriodicity} onValueChange={setSelectedPeriodicity}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Selecione o tipo de periodicidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodicityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 h-12"
                  onClick={handleAdd}
                  disabled={!selectedPeriodicity}
                >
                  + Adicionar
                </Button>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`text-sm mb-4 p-3 rounded-md ${message.type === "error"
                      ? "text-red-700 bg-red-50 border border-red-200"
                      : message.type === "success"
                        ? "text-green-700 bg-green-50 border border-green-200"
                        : "text-blue-700 bg-blue-50 border border-blue-200"
                    }`}
                >
                  {message.text}
                </div>
              )}

              {/* Selected Periodicities */}
              {periodicities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Periodicidades selecionadas:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {periodicities.map((item) => (
                      <div key={item} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <span className="text-sm font-medium">
                          {periodicityOptions.find((o) => o.value === item)?.label || item}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!periodicities.length}
                  className="px-8 bg-transparent"
                >
                  Limpar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!periodicities.length || isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  {isLoading ? "Salvando..." : "Salvar Período"}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
