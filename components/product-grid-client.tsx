"use client"

import { useState } from "react"
import Image from "next/image"
import { ProductModal } from "./product-modal"
import type { Product } from "@/lib/products"

interface ProductGridClientProps {
  products: Product[]
}

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-[#E8E0D4] mb-4">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#4A5D6E]">
                  Sem imagem
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#2B3A4D]/0 group-hover:bg-[#2B3A4D]/20 transition-colors duration-300 flex items-center justify-center">
                <span className="text-[#F5F0E8] opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest uppercase text-sm border border-[#F5F0E8] px-6 py-2">
                  Ver Detalhes
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="text-center">
              <h3 className="text-[#2B3A4D] font-medium tracking-wide mb-2">
                {product.name}
              </h3>
              <p className="text-[#2B3A4D] font-semibold">
                {product.priceFormatted}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
