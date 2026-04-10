import 'server-only'

const MELHOR_ENVIO_API_URL = process.env.MELHOR_ENVIO_SANDBOX === 'true'
  ? 'https://sandbox.melhorenvio.com.br'
  : 'https://melhorenvio.com.br'

const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN!

// CEP de origem da loja (configurável via env ou fixo)
export const ORIGIN_POSTAL_CODE = process.env.ORIGIN_POSTAL_CODE || '01310100'

// Dimensões padrão para moletons/roupas (em cm e kg)
export const DEFAULT_PRODUCT_DIMENSIONS = {
  width: 30,   // cm
  height: 5,   // cm
  length: 40,  // cm
  weight: 0.5, // kg
}

export interface ShippingQuote {
  id: number
  name: string
  price: string
  customPrice: string
  discount: string
  currency: string
  deliveryTime: number
  deliveryRange: {
    min: number
    max: number
  }
  company: {
    id: number
    name: string
    picture: string
  }
  error?: string
}

export interface CalculateShippingParams {
  destinationPostalCode: string
  productValue: number // em centavos
  quantity: number
}

export async function calculateShipping({
  destinationPostalCode,
  productValue,
  quantity,
}: CalculateShippingParams): Promise<ShippingQuote[]> {
  // Remove caracteres não numéricos do CEP
  const cleanPostalCode = destinationPostalCode.replace(/\D/g, '')
  
  if (cleanPostalCode.length !== 8) {
    throw new Error('CEP inválido. O CEP deve ter 8 dígitos.')
  }

  const insuranceValue = (productValue / 100) * quantity // Converte centavos para reais

  const body = {
    from: {
      postal_code: ORIGIN_POSTAL_CODE,
    },
    to: {
      postal_code: cleanPostalCode,
    },
    products: [
      {
        id: 'produto',
        width: DEFAULT_PRODUCT_DIMENSIONS.width,
        height: DEFAULT_PRODUCT_DIMENSIONS.height * quantity,
        length: DEFAULT_PRODUCT_DIMENSIONS.length,
        weight: DEFAULT_PRODUCT_DIMENSIONS.weight * quantity,
        insurance_value: insuranceValue,
        quantity: 1,
      },
    ],
    options: {
      receipt: false,
      own_hand: false,
    },
    // Serviços: 1=PAC, 2=SEDEX, 3=Mini Envios, 17=SEDEX 10
    services: '1,2,3',
  }

  try {
    const response = await fetch(`${MELHOR_ENVIO_API_URL}/api/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'AjoVeste (contato@ajoveste.com.br)',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro Melhor Envio:', errorData)
      throw new Error('Erro ao calcular frete. Tente novamente.')
    }

    const data = await response.json()

    // Filtra e formata os resultados
    const quotes: ShippingQuote[] = data
      .filter((item: { error?: string }) => !item.error)
      .map((item: {
        id: number
        name: string
        price: string
        custom_price: string
        discount: string
        currency: string
        delivery_time: number
        custom_delivery_time: number
        delivery_range: { min: number; max: number }
        custom_delivery_range: { min: number; max: number }
        company: { id: number; name: string; picture: string }
      }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        customPrice: item.custom_price,
        discount: item.discount,
        currency: item.currency,
        deliveryTime: item.custom_delivery_time || item.delivery_time,
        deliveryRange: item.custom_delivery_range || item.delivery_range,
        company: {
          id: item.company.id,
          name: item.company.name,
          picture: item.company.picture,
        },
      }))

    return quotes
  } catch (error) {
    console.error('Erro ao calcular frete:', error)
    throw error instanceof Error ? error : new Error('Erro ao calcular frete')
  }
}
