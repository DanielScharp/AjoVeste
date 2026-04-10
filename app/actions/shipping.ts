'use server'

import { calculateShipping, type ShippingQuote } from '@/lib/melhor-envio'

interface CalculateShippingInput {
  postalCode: string
  productValue: number // em centavos
  quantity: number
}

interface CalculateShippingResult {
  success: boolean
  quotes?: ShippingQuote[]
  error?: string
}

export async function calculateShippingAction({
  postalCode,
  productValue,
  quantity,
}: CalculateShippingInput): Promise<CalculateShippingResult> {
  try {
    const quotes = await calculateShipping({
      destinationPostalCode: postalCode,
      productValue,
      quantity,
    })

    return {
      success: true,
      quotes,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao calcular frete',
    }
  }
}
