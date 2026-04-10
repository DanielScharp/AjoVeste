"use client"

import { useEffect, useRef, useCallback, useState } from "react"

export function ScrollVideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const targetTimeRef = useRef<number>(0)
  const currentTimeRef = useRef<number>(0)
  const isSeekingRef = useRef<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }, [])

  // Desktop: scroll-controlled animation
  useEffect(() => {
    // Skip scroll animation on mobile
    if (isMobile) return

    const video = videoRef.current
    const container = containerRef.current
    
    if (!video || !container) return

    let duration = 0

    const calculateProgress = () => {
      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const windowHeight = window.innerHeight
      
      const scrollEnd = containerHeight - windowHeight
      const scrolled = -rect.top
      
      return Math.max(0, Math.min(1, scrolled / scrollEnd))
    }

    const updateVideoTime = () => {
      if (!video || !duration) return

      const diff = Math.abs(targetTimeRef.current - currentTimeRef.current)
      
      if (diff > 0.01) {
        currentTimeRef.current = lerp(currentTimeRef.current, targetTimeRef.current, 0.15)
        
        if (!isSeekingRef.current && Math.abs(video.currentTime - currentTimeRef.current) > 0.03) {
          isSeekingRef.current = true
          video.currentTime = currentTimeRef.current
        }
      }
      
      rafRef.current = requestAnimationFrame(updateVideoTime)
    }

    const handleScroll = () => {
      if (!duration) return
      const progress = calculateProgress()
      targetTimeRef.current = progress * duration
    }

    const handleSeeked = () => {
      isSeekingRef.current = false
    }

    const handleLoadedMetadata = () => {
      duration = video.duration
      
      if (duration && isFinite(duration)) {
        const progress = calculateProgress()
        targetTimeRef.current = progress * duration
        currentTimeRef.current = targetTimeRef.current
        video.currentTime = currentTimeRef.current
        
        rafRef.current = requestAnimationFrame(updateVideoTime)
        window.addEventListener("scroll", handleScroll, { passive: true })
        video.addEventListener("seeked", handleSeeked)
      }
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    
    if (video.readyState >= 1) {
      handleLoadedMetadata()
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("seeked", handleSeeked)
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [lerp, isMobile])

  // Mobile: simple autoplay loop
  useEffect(() => {
    if (!isMobile) return

    const video = videoRef.current
    if (!video) return

    video.loop = true
    video.play().catch(() => {
      // Autoplay may be blocked, that's okay
    })

    return () => {
      video.loop = false
      video.pause()
    }
  }, [isMobile])

  return (
    <section 
      ref={containerRef}
      id="inicio"
      className={`relative w-full ${isMobile ? 'h-screen' : 'h-[200vh]'}`}
    >
      {/* Sticky video container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Video_displaying_blouse_202604071228-UJuYUAsh3dyYqczMt3pirCsKoRM8Me.mp4"
          muted
          playsInline
          preload="auto"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#2B3A4D]/30" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#F5F0E8] tracking-wider mb-4">
            <span className="text-balance">Tu, porém</span>
          </h1>
          <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#F5F0E8] tracking-wide mb-8">
            Vai até o fim
          </p>
          <p className="text-[#F5F0E8]/80 text-sm md:text-base tracking-widest uppercase mb-8">
            Coleção 2 Timóteo 3:14
          </p>
          <a
            href="#colecao"
            className="inline-block px-8 py-3 border-2 border-[#F5F0E8] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#2B3A4D] transition-all duration-300 tracking-widest uppercase text-sm"
          >
            Ver Coleção
          </a>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[#F5F0E8]/60 text-xs tracking-widest uppercase">Role para explorar</span>
          <div className="w-6 h-10 border-2 border-[#F5F0E8]/60 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#F5F0E8]/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
