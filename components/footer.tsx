import Image from "next/image"
import { Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer id="contato" className="bg-[#F5F0E8] border-t border-[#D4CCC0]">
      {/* Contact Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#2B3A4D] tracking-wide mb-4">
            Entre em Contato
          </h2>
          <p className="text-[#4A5D6E] mb-8 max-w-xl mx-auto">
            Faça seu pedido ou tire suas dúvidas através das nossas redes sociais.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://instagram.com/ajo.veste"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#2B3A4D] text-[#F5F0E8] hover:bg-[#4A5D6E] transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram size={20} />
              <span className="tracking-wide text-sm">@ajo.veste</span>
            </a>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border-2 border-[#2B3A4D] text-[#2B3A4D] hover:bg-[#2B3A4D] hover:text-[#F5F0E8] transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
              <span className="tracking-wide text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#D4CCC0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-05kypkg7Ycbr5OxDSRoBzi2vzzjRI2.jpg"
                alt="Ajô Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-[#2B3A4D] font-medium tracking-wide">Ajo.Veste</span>
            </div>

            {/* Copyright */}
            <p className="text-[#4A5D6E] text-sm">
              © {new Date().getFullYear()} Ajo.Veste. Todos os direitos reservados.
            </p>

            {/* Verse */}
            <p className="text-[#4A5D6E] text-sm italic">
              2 Timóteo 3:14
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
