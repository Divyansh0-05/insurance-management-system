import { Link } from 'react-router-dom'
import { ArrowRight, Shield } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

export default function CTA(){
  return (
    <section data-reveal className="py-20 sm:py-24 bg-white">
      <div className={containerClass}>
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 sm:p-12 lg:p-16 shadow-2xl shadow-emerald-200/50 text-center">
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-300 rounded-full blur-3xl opacity-30" />
          </div>
          
          {/* Grid Pattern Overlay - Very subtle */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] 
                        bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-20" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-600">
                Take the Next Step
              </p>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-950 mb-4">
              Secure Tomorrow.{' '}
              <span className="text-emerald-500">Starting Today.</span>
            </h2>

            {/* Description */}
            <p className="text-emerald-700/80 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              Choose coverage built for real life and get the confidence of reliable support when it matters most.
            </p>

            {/* CTA Button */}
            <Link 
              to="/register" 
              className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl 
                       text-base sm:text-lg font-semibold hover:bg-emerald-700 
                       shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 
                       transition-all duration-300 hover:-translate-y-0.5"
            >
              <Shield className="w-5 h-5" />
              <span>Get Protected Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Trust Indicator */}
            <p className="text-xs text-emerald-500 mt-6">
              No commitment • Free account • 24/7 support
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        </div>
      </div>
    </section>
  )
}