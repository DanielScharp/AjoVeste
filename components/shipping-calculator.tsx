'use client'

import { useState } from 'react'
import { Truck, Loader2 } from 'lucide-react'
import { calculateShippingAction } from '@/app/actions/shipping'
import type { ShippingQuote } from '@/lib/melhor-envio'

interface ShippingCalculatorProps {
  productValue: number // em centavos
  quantity: number
  onSelectShipping?: (quote: ShippingQuote) => void
}

export function ShippingCalculator({ 
  productValue, 
  quantity,
  onSelectShipping 
}: ShippingCalculatorProps) {
  const [postalCode, setPostalCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quotes, setQuotes] = useState<ShippingQuote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(null)

  // Formata o CEP enquanto digita
  const handlePostalCodeChange = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      // Formata como 00000-000
      if (numbers.length > 5) {
        setPostalCode(`${numbers.slice(0, 5)}-${numbers.slice(5)}`)
      } else {
        setPostalCode(numbers)
      }
    }
  }

  const handleCalculate = async () => {
    const cleanPostalCode = postalCode.replace(/\D/g, '')
    
    if (cleanPostalCode.length !== 8) {
      setError('Digite um CEP válido com 8 dígitos')
      return
    }

    setIsLoading(true)
    setError(null)
    setQuotes([])
    setSelectedQuote(null)

    const result = await calculateShippingAction({
      postalCode: cleanPostalCode,
      productValue,
      quantity,
    })

    setIsLoading(false)

    if (result.success && result.quotes) {
      setQuotes(result.quotes)
      if (result.quotes.length === 0) {
        setError('Nenhuma opção de frete disponível para este CEP')
      }
    } else {
      setError(result.error || 'Erro ao calcular frete')
    }
  }

  const handleSelectQuote = (quote: ShippingQuote) => {
    setSelectedQuote(quote)
    onSelectShipping?.(quote)
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numPrice)
  }

  return (
    <div className="bg-[#E8E0D4]/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-5 h-5 text-[#2B3A4D]" />
        <h3 className="text-[#2B3A4D] text-sm font-medium tracking-wide uppercase">
          Calcular Frete
        </h3>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => handlePostalCodeChange(e.target.value)}
          placeholder="00000-000"
          className="flex-1 px-3 py-2 bg-[#F5F0E8] border-2 border-[#D4CCC0] text-[#2B3A4D] placeholder:text-[#4A5D6E]/60 focus:border-[#2B3A4D] focus:outline-none transition-colors text-sm"
          maxLength={9}
        />
        <button
          onClick={handleCalculate}
          disabled={isLoading || postalCode.replace(/\D/g, '').length !== 8}
          className="px-4 py-2 bg-[#2B3A4D] text-[#F5F0E8] text-sm font-medium tracking-wide hover:bg-[#4A5D6E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Calcular'
          )}
        </button>
      </div>

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#4A5D6E] text-xs underline underline-offset-2 hover:text-[#2B3A4D] transition-colors"
      >
        Não sei meu CEP
      </a>

      {error && (
        <p className="mt-3 text-red-600 text-sm">{error}</p>
      )}

      {quotes.length > 0 && (
        <div className="mt-4 space-y-2">
          {quotes.map((quote) => (
            <button
              key={quote.id}
              onClick={() => handleSelectQuote(quote)}
              className={`w-full flex items-center justify-between p-3 border-2 transition-all ${
                selectedQuote?.id === quote.id
                  ? 'border-[#2B3A4D] bg-[#F5F0E8]'
                  : 'border-[#D4CCC0] bg-[#F5F0E8]/50 hover:border-[#4A5D6E]'
              }`}
            >
              <div className="flex items-center gap-3">
                {quote.company.picture && (
                  <img
                    src={quote.company.picture}
                    alt={quote.company.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <div className="text-left">
                  <p className="text-[#2B3A4D] font-medium text-sm">
                    {quote.name}
                  </p>
                  <p className="text-[#4A5D6E] text-xs">
                    {quote.deliveryRange.min === quote.deliveryRange.max
                      ? `${quote.deliveryRange.min} dias úteis`
                      : `${quote.deliveryRange.min} a ${quote.deliveryRange.max} dias úteis`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#2B3A4D] font-semibold text-sm">
                  {formatPrice(quote.customPrice)}
                </p>
                {parseFloat(quote.discount) > 0 && (
                  <p className="text-green-600 text-xs">
                    -{formatPrice(quote.discount)} desc.
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
