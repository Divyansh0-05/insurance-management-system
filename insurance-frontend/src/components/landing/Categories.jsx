const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const categories = [
  {
    title: 'Health Insurance',
    description: 'Care-focused coverage that protects your family during medical uncertainty.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80',
    icon: '🏥',
    features: ['Medical coverage', 'Hospital cash', 'Wellness benefits']
  },
  {
    title: 'Auto Insurance',
    description: 'Reliable protection for every drive, from daily commutes to long journeys.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    icon: '🚗',
    features: ['Collision cover', 'Roadside aid', 'Liability protection']
  },
  {
    title: 'Home Insurance',
    description: 'Security for your home, valuables, and the life you built inside it.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
    icon: '🏠',
    features: ['Property damage', 'Theft protection', 'Natural disasters']
  },
  {
    title: 'Life Insurance',
    description: 'Future-ready support that safeguards loved ones when it matters most.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80',
    icon: '🌱',
    features: ['Term life', 'Whole life', 'Family income']
  },
]

export default function Categories(){
  return (
    <section id="categories" data-reveal className="scroll-mt-28 py-20 sm:py-24 bg-gradient-to-b from-white to-emerald-50/30">
      <div className={containerClass}>
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 shadow-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-800">
              Coverage Options
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-emerald-950">
            Moments worth <span className="text-emerald-600">protecting.</span>
          </h2>
          <p className="text-emerald-700/70 mt-3 max-w-lg">
            Choose from our comprehensive range of insurance solutions tailored to your needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <article 
              key={category.title} 
              className="ui-card group relative h-[420px] lg:h-[460px] rounded-3xl overflow-hidden 
                       border border-emerald-100 shadow-lg shadow-emerald-100/50 
                       hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              
              {/* Gradient Overlay - Adjusted for green theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-900/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                {/* Icon and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl filter drop-shadow-lg">{category.icon}</span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                    {category.title}
                  </h3>
                </div>
                
                {/* Description */}
                <p className="text-sm sm:text-base text-emerald-50/90 max-w-[32ch] leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Features - Appear on hover */}
                <div className="flex flex-wrap gap-2 mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full 
                               border border-white/30"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                                 bg-white text-emerald-700 text-sm font-medium
                                 hover:bg-emerald-50 hover:text-emerald-800 
                                 shadow-lg shadow-black/10 hover:shadow-xl 
                                 transition-all duration-300 hover:-translate-y-0.5">
                  <span>Explore Plan</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Bottom Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>

              {/* Top-right Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-emerald-200">
                ★ Popular choice
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3">
            <span className="text-emerald-700 text-sm">Not sure which plan fits you?</span>
            <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 flex items-center gap-1 group">
              Take our quiz
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}