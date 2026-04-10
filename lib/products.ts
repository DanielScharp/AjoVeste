import { stripe } from './stripe'

export interface Product {
  id: string
  stripeProductId: string
  stripePriceId: string
  name: string
  description: string
  priceInCents: number
  priceFormatted: string
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
}

// Mapeia cores e tamanhos padrão para produtos que não têm metadata
const DEFAULT_COLORS = [
  { name: 'Azul Marinho', hex: '#2B3A4D' },
  { name: 'Preto', hex: '#1A1A1A' },
]

const DEFAULT_SIZES = ['P', 'M', 'G', 'GG', 'XGG']

// Formata preço em centavos para reais
function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100)
}

// Busca todos os produtos ativos do Stripe
export async function getStripeProducts(): Promise<Product[]> {
  try {
    // Buscar produtos ativos
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    })

    const formattedProducts: Product[] = []

    for (const product of products.data) {
      // Pular produtos sem preço padrão
      if (!product.default_price || typeof product.default_price === 'string') {
        continue
      }

      const price = product.default_price
      const priceInCents = price.unit_amount || 0

      // Parse metadata para cores e tamanhos (se existir)
      let colors = DEFAULT_COLORS
      let sizes = DEFAULT_SIZES

      if (product.metadata?.colors) {
        try {
          colors = JSON.parse(product.metadata.colors)
        } catch {
          // Usa cores padrão se falhar o parse
        }
      }

      if (product.metadata?.sizes) {
        try {
          sizes = JSON.parse(product.metadata.sizes)
        } catch {
          // Usa tamanhos padrão se falhar o parse
        }
      }

      formattedProducts.push({
        id: product.id,
        stripeProductId: product.id,
        stripePriceId: price.id,
        name: product.name,
        description: product.description || '',
        priceInCents,
        priceFormatted: formatPrice(priceInCents),
        images: product.images || [],
        colors,
        sizes,
      })
    }

    return formattedProducts
  } catch (error) {
    console.error('Erro ao buscar produtos do Stripe:', error)
    return []
  }
}

// Busca um produto específico pelo ID do Stripe
export async function getStripeProductById(productId: string): Promise<Product | null> {
  try {
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    })

    if (!product.default_price || typeof product.default_price === 'string') {
      return null
    }

    const price = product.default_price
    const priceInCents = price.unit_amount || 0

    let colors = DEFAULT_COLORS
    let sizes = DEFAULT_SIZES

    if (product.metadata?.colors) {
      try {
        colors = JSON.parse(product.metadata.colors)
      } catch {
        // Usa cores padrão
      }
    }

    if (product.metadata?.sizes) {
      try {
        sizes = JSON.parse(product.metadata.sizes)
      } catch {
        // Usa tamanhos padrão
      }
    }

    return {
      id: product.id,
      stripeProductId: product.id,
      stripePriceId: price.id,
      name: product.name,
      description: product.description || '',
      priceInCents,
      priceFormatted: formatPrice(priceInCents),
      images: product.images || [],
      colors,
      sizes,
    }
  } catch (error) {
    console.error('Erro ao buscar produto do Stripe:', error)
    return null
  }
}
