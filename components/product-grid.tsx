import { getStripeProducts } from "@/lib/products"
import { ProductGridClient } from "./product-grid-client"

export async function ProductGrid() {
  const products = await getStripeProducts()

  return (
    <section id="colecao" className="py-20 md:py-32 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-[#2B3A4D] tracking-wide mb-4">
            Coleção
          </h2>
          <p className="text-[#4A5D6E] tracking-wide max-w-2xl mx-auto">
            Peças exclusivas que carregam uma mensagem de fé e perseverança. 
            Cada detalhe foi pensado para você que vai até o fim.
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <ProductGridClient products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-[#4A5D6E]">Nenhum produto disponível no momento.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#contato"
            className="inline-block px-10 py-4 bg-[#2B3A4D] text-[#F5F0E8] hover:bg-[#4A5D6E] transition-colors duration-300 tracking-widest uppercase text-sm"
          >
            Fazer Pedido
          </a>
        </div>
      </div>
    </section>
  )
}
