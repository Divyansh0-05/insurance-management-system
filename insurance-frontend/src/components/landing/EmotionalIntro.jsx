const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

export default function EmotionalIntro(){
  return (
    <section data-reveal className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full 
                      bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      </div>
      
      {/* Grid Pattern Overlay - Very subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] 
                    bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-20" />

      <div className={`${containerClass} relative z-10 text-center`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-600">
            Moments We Protect
          </p>
        </div>

        {/* Main Heading */}
        <h2 className="text-[clamp(2rem,5.3vw,4.4rem)] leading-[1.1] font-semibold tracking-tight text-emerald-950 max-w-5xl mx-auto">
          Life Is{' '}
          <span className="text-emerald-500">Unpredictable.</span>
          <br />
          Protection <span className="text-emerald-600">Shouldn't Be.</span>
        </h2>

        {/* Description */}
        <p className="mt-8 text-emerald-700/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
          From everyday routines to unexpected emergencies, we help families stay financially secure.
          <br className="hidden sm:block" />
          <span className="text-emerald-600 font-medium">Choose coverage designed for real life</span>, backed by clarity and confidence.
        </p>

        {/* Simple bottom accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
      </div>
    </section>
  )
}