import { Quote } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const testimonials = [
  {
    name: 'Ava Richardson',
    role: 'Operations Lead',
    review:
      'Claim tracking is finally clear for our team. The platform feels calm, reliable, and easy to trust.',
    initials: 'AR',
  },
  {
    name: 'Liam Parker',
    role: 'Small Business Owner',
    review:
      'Policy setup was straightforward and support responded fast. It gave us confidence during a critical period.',
    initials: 'LP',
  },
  {
    name: 'Sophia Bennett',
    role: 'HR Manager',
    review:
      'We switched from a legacy provider and instantly improved response time and employee satisfaction.',
    initials: 'SB',
  },
]

export default function Testimonials(){
  return (
    <section data-reveal className="py-20 sm:py-24 bg-white">
      <div className={containerClass}>
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-600">
              Testimonials
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-emerald-950">
            Real stories from{' '}
            <span className="text-emerald-500">trusted teams.</span>
          </h2>
          <p className="text-emerald-700/70 mt-3 text-lg max-w-xl">
            See what our customers have to say about their experience
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="group relative rounded-2xl border border-emerald-100 bg-white p-8 
                       shadow-lg shadow-emerald-100/30 hover:shadow-xl hover:shadow-emerald-200/40
                       hover:-translate-y-1 hover:border-emerald-300
                       transition-all duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-emerald-600" />
              </div>

              {/* Avatar with initials */}
              <div className="relative mb-5">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 border-2 border-emerald-200 
                              flex items-center justify-center text-emerald-600 font-semibold text-lg
                              group-hover:bg-emerald-200 group-hover:border-emerald-300 
                              group-hover:scale-110 transition-all duration-300">
                  {item.initials}
                </div>
                {/* Decorative glow */}
                <div className="absolute -inset-1 rounded-xl bg-emerald-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Name and Role */}
              <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-emerald-600 mb-4">
                {item.role}
              </p>

              {/* Review Text */}
              <p className="text-sm sm:text-base leading-relaxed text-emerald-700/80 italic">
                "{item.review}"
              </p>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-emerald-400 text-sm">★</span>
                ))}
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent 
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </article>
          ))}
        </div>

        {/* Trust Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white 
                                      flex items-center justify-center text-xs font-medium text-emerald-700">
                  {['JD', 'MK', 'SL'][i-1]}
                </div>
              ))}
            </div>
            <p className="text-sm text-emerald-700">
              <span className="font-semibold text-emerald-900">500+</span> 5-star reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}