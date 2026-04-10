'use server'

import { stripe } from '@/lib/stripe'
import { getStripeProductById } from '@/lib/products'

interface ShippingInfo {
  name: string
  price: string // em formato string ex: "25.50"
  deliveryDays: number
  company: string
}

interface CheckoutOptions {
  productId: string
  size: string
  color: string
  quantity?: number
  shipping?: ShippingInfo
}

export async function startCheckoutSession({ productId, size, color, quantity = 1, shipping }: CheckoutOptions) {
  const product = await getStripeProductById(productId)
  if (!product) {
    throw new Error(`Produto com id "${productId}" não encontrado no Stripe`)
  }

  // Criar line items com o produto
  const lineItems: {
    price?: string
    price_data?: {
      currency: string
      product_data: {
        name: string
        description?: string
      }
      unit_amount: number
    }
    quantity: number
  }[] = [
    {
      price: product.stripePriceId,
      quantity,
    },
  ]

  // Adicionar frete como line item separado se houver
  if (shipping) {
    const shippingPriceInCents = Math.round(parseFloat(shipping.price) * 100)
    lineItems.push({
      price_data: {
        currency: 'brl',
        product_data: {
          name: `Frete - ${shipping.name}`,
          description: `${shipping.company} - ${shipping.deliveryDays} dias úteis`,
        },
        unit_amount: shippingPriceInCents,
      },
      quantity: 1,
    })
  }

  // Montar descrição e metadata incluindo frete
  const shippingDescription = shipping 
    ? ` | Frete: ${shipping.name} (${shipping.company})`
    : ''
  
  const shippingMessage = shipping
    ? `\nFrete: ${shipping.name} - ${shipping.deliveryDays} dias úteis`
    : ''

  // Criar sessão de Checkout usando o price_id do Stripe
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['BR'],
    },
    phone_number_collection: {
      enabled: true,
    },
    payment_intent_data: {
      description: `${product.name} - Tamanho: ${size} | Cor: ${color} | Qtd: ${quantity}${shippingDescription}`,
      metadata: {
        productId: product.id,
        productName: product.name,
        size,
        color,
        quantity: String(quantity),
        shippingMethod: shipping?.name || '',
        shippingCompany: shipping?.company || '',
        shippingPrice: shipping?.price || '',
        shippingDeliveryDays: shipping ? String(shipping.deliveryDays) : '',
      },
    },
    metadata: {
      productId: product.id,
      productName: product.name,
      size,
      color,
      quantity: String(quantity),
      shippingMethod: shipping?.name || '',
      shippingCompany: shipping?.company || '',
      shippingPrice: shipping?.price || '',
      shippingDeliveryDays: shipping ? String(shipping.deliveryDays) : '',
    },
    custom_text: {
      submit: {
        message: `Pedido: ${product.name}\nTamanho: ${size} | Cor: ${color} | Quantidade: ${quantity}${shippingMessage}`,
      },
    },
  })

  return session.client_secret
}
