import { useEffect } from 'react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import TrustSection from '@/components/landing/TrustSection'
import Features from '@/components/landing/Features'
import EmotionalIntro from '@/components/landing/EmotionalIntro'
import Categories from '@/components/landing/Categories'
import Stats from '@/components/landing/Stats'
import Testimonials from '@/components/landing/Testimonials'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Landing(){
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    if(!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#07090d] text-slate-100 scroll-smooth">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60rem_32rem_at_85%_-6%,rgba(255,255,255,0.08),transparent)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(36rem_24rem_at_8%_75%,rgba(148,163,184,0.12),transparent)]" />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <TrustSection />
        <Features />
        <EmotionalIntro />
        <Categories />
        <Stats />
        <Testimonials />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
