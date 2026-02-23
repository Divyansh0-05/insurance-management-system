const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const trustBadges = [
  { 
    title: '99.9% Uptime', 
    description: 'Consistent platform reliability for mission-critical operations.',
    icon: '⚡',
    stat: '99.9%',
    statLabel: 'Average uptime'
  },
  { 
    title: 'Secure Infrastructure', 
    description: 'Protected environments and hardened security practices.',
    icon: '🛡️',
    stat: 'AES-256',
    statLabel: 'Encryption'
  },
  { 
    title: '24/7 Support', 
    description: 'Round-the-clock assistance from a responsive support team.',
    icon: '💬',
    stat: '< 5 mins',
    statLabel: 'Avg response time'
  },
]

const partners = [
  { name: 'Microsoft', category: 'Technology' },
  { name: 'JPMorgan', category: 'Finance' },
  { name: 'UnitedHealth', category: 'Healthcare' },
  { name: 'Walmart', category: 'Retail' },
  { name: 'Tesla', category: 'Automotive' },
]

export default function TrustSection(){
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className={containerClass}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-600">Trusted globally</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-emerald-950 mb-6">
            Built for the world's most
            <span className="text-emerald-500 block mt-2">demanding organizations</span>
          </h2>
          
          <p className="text-lg text-emerald-700/70 max-w-2xl mx-auto">
            From fast-growing startups to Fortune 500 enterprises, companies trust us to protect what matters most.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-24">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group relative p-6 bg-emerald-50/30 rounded-xl border border-emerald-100 
                       hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md hover:shadow-emerald-100/50
                       transition-all duration-300 cursor-default"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="text-center">
                <div className="font-semibold text-emerald-800 group-hover:text-emerald-600 transition-colors">
                  {partner.name}
                </div>
                <div className="text-xs text-emerald-500 mt-1">
                  {partner.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustBadges.map((badge, index) => (
            <article
              key={badge.title}
              className="group relative bg-white rounded-3xl p-8 
                       border border-emerald-100 shadow-lg shadow-emerald-100/30
                       hover:shadow-xl hover:shadow-emerald-200/40
                       hover:border-emerald-300 hover:-translate-y-1
                       transition-all duration-500"
              style={{ transitionDelay: `${120 + index * 50}ms` }}
            >
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl 
                                group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300">
                    {badge.icon}
                  </div>
                </div>

                {/* Title and stat */}
                <div className="flex items-end justify-between mb-4">
                  <h3 className="text-xl font-semibold text-emerald-900">
                    {badge.title}
                  </h3>
                  <span className="text-2xl font-bold text-emerald-500">
                    {badge.stat}
                  </span>
                </div>

                {/* Stat label */}
                <p className="text-sm font-medium text-emerald-500 mb-3">
                  {badge.statLabel}
                </p>

                {/* Description */}
                <p className="text-emerald-700/70 text-sm leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent 
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}