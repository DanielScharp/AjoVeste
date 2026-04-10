import { Navigation } from "@/components/navigation"
import { ScrollVideoHero } from "@/components/scroll-video-hero"
import { ProductGrid } from "@/components/product-grid"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <Navigation />
      <ScrollVideoHero />
      <ProductGrid />
      <AboutSection />
      <Footer />
    </main>
  )
}
