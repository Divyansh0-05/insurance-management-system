import { ShieldCheck, Zap, BarChart3, Lock, ArrowRight } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const features = [
  { 
    title: 'Secure JWT Authentication', 
    description: 'Strong identity controls and protected sessions built for trust-first operations.',
    icon: ShieldCheck,
  },
  { 
    title: 'Fast Claim Processing', 
    description: 'Intuitive claim handling that reduces waiting time and improves user confidence.',
    icon: Zap,
  },
  { 
    title: 'Real-Time Dashboard', 
    description: 'Actionable metrics for coverage, approvals, and payouts in one focused view.',
    icon: BarChart3,
  },
  { 
    title: 'Role-Based Access Control', 
    description: 'Clear separation between user and admin workflows for safe daily operations.',
    icon: Lock,
  },
]

export default function Features(){
  return (
    <section id="features" data-reveal className="scroll-mt-28 py-20 sm:py-24 bg-white">
      <div className={containerClass}>
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-600">
              Capabilities
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-emerald-950 mb-4">
            Built for reliability{' '}
            <span className="text-emerald-500">at every step.</span>
          </h2>
          <p className="text-emerald-700/70 text-lg max-w-xl">
            Powerful features designed to make insurance management seamless and secure
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <article 
                key={feature.title} 
                className="group h-full rounded-2xl bg-white p-8 
                         border border-emerald-100 shadow-md shadow-emerald-100/30
                         hover:shadow-xl hover:shadow-emerald-200/40 hover:border-emerald-300
                         hover:-translate-y-1 transition-all duration-300 
                         relative overflow-hidden"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon with colored background */}
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 
                              group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300">
                  <Icon className="w-7 h-7 text-emerald-600" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm leading-relaxed text-emerald-700/80 mb-6">
                  {feature.description}
                </p>
                
                {/* Learn more link */}
                <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium group-hover:text-emerald-600 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Subtle top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </article>
            )
          })}
        </div>

        {/* Feature Highlight Stats - Simplified */}
        <div className="mt-20 pt-12 border-t border-emerald-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: '10,000+' },
              { label: 'Claims Processed', value: '50,000+' },
              { label: 'Avg. Response Time', value: '< 2min' },
              { label: 'Satisfaction Rate', value: '98%' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</p>
                <p className="text-sm text-emerald-700/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}