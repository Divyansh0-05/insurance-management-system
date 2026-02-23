import { CheckCircle } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Register securely and set up your profile in minutes.',
  },
  {
    number: '02',
    title: 'Choose Insurance',
    description: 'Compare plans and pick coverage that fits your priorities.',
  },
  {
    number: '03',
    title: 'Manage Claims Easily',
    description: 'Submit claims, track updates, and get quick support anytime.',
  },
]

export default function HowItWorks(){
  return (
    <section id="how-it-works" data-reveal className="scroll-mt-28 py-20 sm:py-24 bg-white">
      <div className={containerClass}>
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-600">
              How It Works
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-emerald-950">
            A clear path from signup{' '}
            <span className="text-emerald-500">to peace of mind.</span>
          </h2>
          <p className="text-emerald-700/70 mt-3 text-lg max-w-xl">
            Get protected in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="group relative rounded-3xl border border-emerald-100 bg-white p-8 
                       shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/50 
                       hover:-translate-y-1 transition-all duration-300"
            >
              {/* Step Number Circle */}
              <div className="relative mb-6">
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-emerald-200/50 blur-xl group-hover:bg-emerald-300/50 transition-colors" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 
                              flex items-center justify-center text-emerald-600 text-lg font-bold
                              group-hover:bg-emerald-200 group-hover:border-emerald-300 group-hover:scale-110 
                              transition-all duration-300">
                  {step.number}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-emerald-700/80 leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-emerald-500 rounded-full group-hover:w-full transition-all duration-500" />
                </div>
                <span className="text-xs text-emerald-500 font-medium">
                  Step {index + 1}/3
                </span>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-emerald-600 bg-emerald-50 inline-block px-6 py-3 rounded-full border border-emerald-100">
            ⚡ Average setup time: less than 5 minutes
          </p>
        </div>
      </div>
    </section>
  )
}