const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const stats = [
  { value: '10K+', label: 'Active Policies', icon: '📋' },
  { value: '98%', label: 'Claim Approval Rate', icon: '✓' },
  { value: '4.9★', label: 'Customer Satisfaction', icon: '⭐' },
  { value: '24/7', label: 'Support', icon: '💬' },
]

export default function Stats(){
  return (
    <section data-reveal className="py-20 sm:py-24 bg-white">
      <div className={containerClass}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <article
              key={stat.label}
              className="group rounded-2xl border border-emerald-100 bg-white p-8 
                       shadow-lg shadow-emerald-100/30 hover:shadow-xl hover:shadow-emerald-200/40
                       hover:-translate-y-1 hover:border-emerald-300
                       transition-all duration-300 text-center relative overflow-hidden"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              {/* Value */}
              <p className="text-4xl sm:text-5xl font-bold text-emerald-600 mb-2">
                {stat.value}
              </p>
              
              {/* Label */}
              <p className="text-sm sm:text-base text-emerald-700/70 font-medium">
                {stat.label}
              </p>

              {/* Decorative corner dot */}
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-300 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}