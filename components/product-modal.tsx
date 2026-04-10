"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkout } from "./checkout"
import { ShippingCalculator } from "./shipping-calculator"
import type { Product } from "@/lib/products"
import type { ShippingQuote } from "@/lib/melhor-envio"

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedShipping, setSelectedShipping] = useState<ShippingQuote | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [showCheckout, setShowCheckout] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handlePrevImage = useCallback(() => {
    if (!product) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
    setIsZoomed(false)
  }, [product])

  const handleNextImage = useCallback(() => {
    if (!product) return
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
    setIsZoomed(false)
  }, [product])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageContainerRef.current) return
    
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }, [isZoomed])

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev)
    setZoomPosition({ x: 50, y: 50 })
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      onClose()
      setCurrentImageIndex(0)
      setSelectedSize(null)
      setSelectedColor(null)
      setQuantity(1)
      setSelectedShipping(null)
      setIsZoomed(false)
      setShowCheckout(false)
    }
  }, [onClose])

  const handleProceedToCheckout = useCallback(() => {
    if (selectedSize && selectedColor) {
      setShowCheckout(true)
    }
  }, [selectedSize, selectedColor])

  const handleBackFromCheckout = useCallback(() => {
    setShowCheckout(false)
  }, [])

  if (!product) return null

  const currentImage = product.images[currentImageIndex]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-7xl 2xl:max-w-[1400px] w-full h-[90vh] md:h-[88vh] lg:h-[90vh] xl:h-[92vh] overflow-hidden p-0 bg-[#F5F0E8] border-none rounded-lg"
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Detalhes do produto {product.name} - {product.description}. Preço: {product.priceFormatted}
        </DialogDescription>
        
        {/* Checkout View */}
        {showCheckout && selectedSize && selectedColor ? (
          <Checkout
            productId={product.id}
            productName={product.name}
            size={selectedSize}
            color={selectedColor}
            quantity={quantity}
            shipping={selectedShipping}
            onBack={handleBackFromCheckout}
            onClose={onClose}
          />
        ) : (
          <>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-[#2B3A4D]/80 hover:bg-[#2B3A4D] text-[#F5F0E8] rounded-full transition-colors duration-200"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Image Section - Top on mobile, Left on desktop */}
          <div className="relative bg-[#f7f2e6] h-[35%] md:h-[40%] lg:h-full lg:w-1/2 xl:w-[55%] flex-shrink-0">
            {/* Main Image */}
            <div 
              ref={imageContainerRef}
              className="relative w-full h-full cursor-zoom-in overflow-hidden"
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomed && setIsZoomed(false)}
            >
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                  fill
                  className={`object-contain transition-transform duration-300 ${
                    isZoomed ? "scale-[2.5] cursor-zoom-out" : "scale-100"
                  }`}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : undefined}
                  priority
                />
              )}
              
              {/* Zoom Indicator */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#2B3A4D]/70 text-[#F5F0E8] px-3 py-1.5 rounded-full text-xs">
                {isZoomed ? (
                  <>
                    <ZoomOut className="w-4 h-4" />
                    <span>Clique para diminuir</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    <span>Clique para ampliar</span>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[#2B3A4D]/70 hover:bg-[#2B3A4D] text-[#F5F0E8] rounded-full transition-colors duration-200"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#2B3A4D]/70 hover:bg-[#2B3A4D] text-[#F5F0E8] rounded-full transition-colors duration-200"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail Previews */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-[#F5F0E8]/80 backdrop-blur-sm p-1.5 rounded-lg">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      setIsZoomed(false)
                    }}
                    className={`relative w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded transition-all duration-200 ${
                      index === currentImageIndex 
                        ? "ring-2 ring-[#2B3A4D] ring-offset-1 ring-offset-[#F5F0E8]/80" 
                        : "opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Bottom on mobile, Right on desktop */}
          <div className="flex-1 min-h-0 overflow-y-auto lg:w-1/2 xl:w-[45%] scrollbar-ajo">
            <div className="p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col">
            {/* Product Info */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl lg:text-4xl text-[#2B3A4D] tracking-wide mb-2">
                {product.name}
              </h2>
              <p className="text-[#4A5D6E] text-sm md:text-base mb-4">
                {product.description}
              </p>
              <p className="text-[#2B3A4D] text-2xl lg:text-3xl font-semibold">
                {product.priceFormatted}
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-[#2B3A4D] text-sm font-medium tracking-wide uppercase mb-3">
                Cor {selectedColor && <span className="font-normal normal-case">- {selectedColor}</span>}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.name
                        ? "border-[#2B3A4D] scale-110 ring-2 ring-offset-2 ring-[#2B3A4D]"
                        : "border-[#D4CCC0] hover:border-[#4A5D6E]"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Selecionar cor ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-[#2B3A4D] text-sm font-medium tracking-wide uppercase mb-3">
                Tamanho {selectedSize && <span className="font-normal">- {selectedSize}</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 h-12 px-4 border-2 transition-all duration-200 tracking-wide text-sm font-medium ${
                      selectedSize === size
                        ? "bg-[#2B3A4D] text-[#F5F0E8] border-[#2B3A4D]"
                        : "bg-transparent text-[#2B3A4D] border-[#D4CCC0] hover:border-[#2B3A4D]"
                    }`}
                    aria-label={`Selecionar tamanho ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Guide */}
            <button className="text-[#4A5D6E] text-sm underline underline-offset-4 hover:text-[#2B3A4D] transition-colors duration-200 mb-8 text-left w-fit">
              Guia de tamanhos
            </button>

            {/* Quantity Selection */}
            <div className="mb-8">
              <h3 className="text-[#2B3A4D] text-sm font-medium tracking-wide uppercase mb-3">
                Quantidade
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-[#D4CCC0]">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-[#2B3A4D] hover:bg-[#E8E0D4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-[#2B3A4D] font-medium text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                    disabled={quantity >= 10}
                    className="p-3 text-[#2B3A4D] hover:bg-[#E8E0D4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[#4A5D6E] text-sm">
                  Máximo 10 unidades
                </span>
              </div>
            </div>

            {/* Shipping Calculator */}
            <div className="mb-8">
              <ShippingCalculator
                productValue={product.priceInCents}
                quantity={quantity}
                onSelectShipping={setSelectedShipping}
              />
            </div>

            {/* Add to Cart Button */}
            <div className="mt-auto pt-6 border-t border-[#D4CCC0]">
              <button
                onClick={handleProceedToCheckout}
                disabled={!selectedSize || !selectedColor}
                className={`w-full py-4 lg:py-5 tracking-widths uppercase text-sm lg:text-base font-medium transition-all duration-300 ${
                  selectedSize && selectedColor
                    ? "bg-[#2B3A4D] text-[#F5F0E8] hover:bg-[#4A5D6E]"
                    : "bg-[#D4CCC0] text-[#4A5D6E] cursor-not-allowed"
                }`}
              >
                {selectedSize && selectedColor 
                  ? "Fazer Pedido" 
                  : "Selecione cor e tamanho"}
              </button>
            </div>
            </div>
          </div>
        </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
