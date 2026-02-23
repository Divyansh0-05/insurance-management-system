import { Link } from 'react-router-dom'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

export default function Hero(){
  return (
    <section className="relative min-h-[calc(100svh-64px)] sm:min-h-[calc(100svh-80px)] pt-28 sm:pt-32 pb-20 sm:pb-24 flex items-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.03),transparent_50%)]" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)] opacity-20" />

      <div className={`${containerClass} relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center`}>
        {/* Left Content */}
        <div data-reveal className="relative z-10 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-800">
              Trusted Digital Insurance
            </p>
          </div>
          
          <h1 className="text-[clamp(2.2rem,5.8vw,4.8rem)] leading-[0.98] font-semibold tracking-tight text-emerald-950 max-w-[14ch] mx-auto lg:mx-0">
            Protection for
            <br />
            <span className="text-emerald-600">Life's Unpredictable</span> Moments.
          </h1>
          
          <p className="text-emerald-800/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
            When life changes without warning, your family should still feel secure. 
            Our platform helps you choose coverage, submit claims, and stay informed 
            with clarity and confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link 
              to="/register" 
              className="group px-7 py-3.5 rounded-xl bg-emerald-600 text-white text-sm sm:text-base font-semibold 
                       hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 
                       transition-all duration-300 hover:shadow-xl hover:shadow-emerald-300/50 
                       hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex items-center gap-2">
                Get Protected Today
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <a 
              href="#features" 
              className="px-7 py-3.5 rounded-xl border-2 border-emerald-200 bg-white/80 
                       text-emerald-800 text-sm sm:text-base font-medium
                       hover:bg-white hover:border-emerald-300 hover:text-emerald-900
                       transition-all duration-300 backdrop-blur-sm"
            >
              Explore Plans
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-700">👤</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-emerald-700">
              <span className="font-semibold text-emerald-900">10,000+</span> families protected
            </p>
          </div>
        </div>

        {/* Right Content - Modern Card */}
        <div data-reveal style={{ transitionDelay: '120ms' }} className="relative z-10">
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl" />
          
          <div className="relative rounded-[2rem] bg-white shadow-2xl shadow-emerald-200/50 border border-emerald-100 overflow-hidden backdrop-blur-sm">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-50 text-xs font-medium uppercase tracking-wider opacity-90">
                    Active Policy
                  </p>
                  <p className="text-white text-xl font-semibold mt-1">
                    Family Shield Plus
                  </p>
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <p className="text-white text-xs font-medium">
                    ID: FSP-2024-001
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-emerald-600 text-xs font-medium mb-1">Coverage</p>
                  <p className="text-emerald-900 text-lg font-bold">$2.5M</p>
                  <p className="text-emerald-500 text-[10px]">Lifetime max</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-emerald-600 text-xs font-medium mb-1">Members</p>
                  <p className="text-emerald-900 text-lg font-bold">4</p>
                  <p className="text-emerald-500 text-[10px]">Family covered</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-emerald-600 text-xs font-medium mb-1">Claims</p>
                  <p className="text-emerald-900 text-lg font-bold">2</p>
                  <p className="text-emerald-500 text-[10px]">This year</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-emerald-800">Annual Deductible</span>
                    <span className="text-emerald-600 font-semibold">$850/$2,500</span>
                  </div>
                  <div className="h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full w-[34%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-emerald-800">Wellness Credit</span>
                    <span className="text-emerald-600 font-semibold">$200/$500</span>
                  </div>
                  <div className="h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-900 text-sm font-medium">Claim #CLM-2084 Approved</p>
                    <p className="text-emerald-600 text-xs mt-0.5">Reimbursement of $2,450 scheduled for tomorrow</p>
                  </div>
                  <span className="text-emerald-500 text-xs font-medium">New</span>
                </div>
              </div>

              {/* Next Payment */}
              <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                <div>
                  <p className="text-emerald-500 text-xs">Next Payment</p>
                  <p className="text-emerald-900 font-semibold">May 15, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-500 text-xs">Amount</p>
                  <p className="text-emerald-900 font-semibold">$249.00</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  Pay Now
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-emerald-50 px-6 py-3 border-t border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-emerald-700 text-xs">Coverage Active - 24/7 Support</p>
                </div>
                <p className="text-emerald-500 text-xs">Updated 2 min ago</p>
              </div>
            </div>
          </div>

          {/* Decorative Badge */}
          <div className="absolute -bottom-3 -right-3 bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
            ⚡ 2 days until renewal
          </div>
        </div>
      </div>
    </section>
  )
}