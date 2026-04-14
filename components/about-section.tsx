import Image from "next/image"

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 md:py-32 bg-[#2B3A4D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden order-2 lg:order-1">
            <Image
              src="./DoisLados.png"
              alt="Moletom Ajo.Veste - Tu, Porém Vai Até o Fim"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-3xl md:text-5xl text-[#F5F0E8] tracking-wide mb-8">
              Sobre a Marca
            </h2>
            
            <div className="space-y-6 text-[#F5F0E8]/80 leading-relaxed">
              <p>
                A <strong className="text-[#F5F0E8]">Ajo.Veste</strong> nasceu da vontade de unir moda streetwear 
                premium com mensagens que inspiram e fortalecem a fé.
              </p>
              
              <p>
                Cada peça é cuidadosamente desenvolvida para quem busca mais do que estilo — 
                busca propósito. Nossa coleção atual é inspirada em{" "}
                <strong className="text-[#F5F0E8]">2 Timóteo 3:14</strong>: 
                &quot;Permanece nas coisas que aprendeste e de que foste inteirado, 
                sabendo de quem as aprendeste.&quot;
              </p>

              <p>
                <em className="font-serif text-xl text-[#F5F0E8]">
                  &quot;Tu, porém, vai até o fim&quot;
                </em>{" "}
                é mais do que um slogan — é um lembrete diário de perseverança 
                e determinação.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-8">
              <div className="text-center">
                <p className="font-serif text-3xl text-[#F5F0E8]">100%</p>
                <p className="text-[#F5F0E8]/60 text-sm tracking-wide">Algodão Premium</p>
              </div>
              <div className="w-px h-12 bg-[#F5F0E8]/20" />
              <div className="text-center">
                <p className="font-serif text-3xl text-[#F5F0E8]">Ed.</p>
                <p className="text-[#F5F0E8]/60 text-sm tracking-wide">Limitada</p>
              </div>
              <div className="w-px h-12 bg-[#F5F0E8]/20" />
              <div className="text-center">
                <p className="font-serif text-3xl text-[#F5F0E8]">BR</p>
                <p className="text-[#F5F0E8]/60 text-sm tracking-wide">Produção Nacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
