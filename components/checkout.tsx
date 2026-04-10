'use client'

import { useMemo, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { X, ArrowLeft, Truck } from 'lucide-react'
import { startCheckoutSession } from '@/app/actions/stripe'
import type { ShippingQuote } from '@/lib/melhor-envio'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutProps {
  productId: string
  productName: string
  size: string
  color: string
  quantity: number
  shipping: ShippingQuote | null
  onBack: () => void
  onClose: () => void
}

export function Checkout({ productId, productName, size, color, quantity, shipping, onBack, onClose }: CheckoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Create a unique key based on product options to force remount when they change
  const checkoutKey = useMemo(() => `${productId}-${size}-${color}-${quantity}-${shipping?.id || 'no-shipping'}`, [productId, size, color, quantity, shipping])

  // Memoize options to prevent recreating on every render
  const options = useMemo(() => ({
    fetchClientSecret: async () => {
      const clientSecret = await startCheckoutSession({
        productId,
        size,
        color,
        quantity,
        shipping: shipping ? {
          name: shipping.name,
          price: shipping.customPrice,
          deliveryDays: shipping.deliveryTime,
          company: shipping.company.name,
        } : undefined,
      })
      setIsLoading(false)
      return clientSecret!
    }
  }), [productId, size, color, quantity, shipping])

  const formatShippingPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numPrice)
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F0E8] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-3 md:p-4 border-b border-[#D4CCC0]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 md:gap-2 text-[#2B3A4D] hover:text-[#4A5D6E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-xs md:text-sm tracking-wide">Voltar</span>
        </button>
        
        <h2 className="font-serif text-base md:text-lg text-[#2B3A4D]">Finalizar Compra</h2>
        
        <button
          onClick={onClose}
          className="p-1.5 md:p-2 text-[#2B3A4D] hover:bg-[#2B3A4D]/10 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Order Summary */}
      <div className="flex-shrink-0 p-3 md:p-4 border-b border-[#D4CCC0] bg-[#E8E0D4]/50">
        <p className="text-xs md:text-sm text-[#4A5D6E] mb-0.5 md:mb-1">Resumo do pedido:</p>
        <p className="text-[#2B3A4D] font-medium text-sm md:text-base">{productName}</p>
        <p className="text-xs md:text-sm text-[#4A5D6E]">
          Tamanho: {size} | Cor: {color} | Quantidade: {quantity}
        </p>
        
        {shipping && (
          <div className="mt-2 pt-2 border-t border-[#D4CCC0]/50 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#4A5D6E]" />
            <div className="flex-1">
              <p className="text-xs md:text-sm text-[#2B3A4D]">
                {shipping.name} ({shipping.company.name})
              </p>
              <p className="text-xs text-[#4A5D6E]">
                {shipping.deliveryRange.min === shipping.deliveryRange.max
                  ? `${shipping.deliveryRange.min} dias úteis`
                  : `${shipping.deliveryRange.min} a ${shipping.deliveryRange.max} dias úteis`}
              </p>
            </div>
            <p className="text-sm font-semibold text-[#2B3A4D]">
              {formatShippingPrice(shipping.customPrice)}
            </p>
          </div>
        )}
      </div>

      {/* Checkout Form */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-ajo">
        <div className="p-3 md:p-4 lg:p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-2 border-[#2B3A4D] border-t-transparent"></div>
            </div>
          )}
          
          <div 
            id="checkout" 
            className={`${isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 transition-opacity duration-300'}`}
          >
            <EmbeddedCheckoutProvider
              key={checkoutKey}
              stripe={stripePromise}
              options={options}
            >
              <EmbeddedCheckout className="min-h-[400px]" />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
